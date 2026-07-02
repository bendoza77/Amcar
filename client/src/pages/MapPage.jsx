import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  LocateFixed,
  Wrench,
  Loader2,
  SlidersHorizontal,
  X,
  Navigation,
} from "lucide-react";
import "../styles/maps.css";

import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../hooks/useTranslation";
import { mechanicsApi, resolveImage } from "../lib/api";
import { getOpenStatus, useNow } from "../lib/openStatus";
import { MECHANIC_CATEGORIES } from "../constants/site";
import MechanicDetailPanel from "../components/map/MechanicDetailPanel";
import { cn } from "../lib/utils";

// Default view — Tbilisi, until the user's real location arrives.
const DEFAULT_CENTER = { lat: 41.7151, lng: 44.8271 };
const DEFAULT_ZOOM = 12;

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

/**
 * MapPage — full-screen Google map of Amcar car mechanics. Tracks the user's
 * real-time location, plots every mechanic as a pin with a hover preview, and
 * opens a full designed profile panel on click.
 */
export default function MapPage() {
  if (!API_KEY) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface px-6 text-center">
        <div>
          <h1 className="text-lg font-bold text-fg">Map unavailable</h1>
          <p className="mt-2 text-sm text-text-muted">
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in the client environment to load the map.
          </p>
          <Link to="/home" className="mt-4 inline-flex text-sm font-semibold text-accent">
            ← Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <MapView />
    </APIProvider>
  );
}

function MapView() {
  const { isDark } = useTheme();
  const { t, lang } = useTranslation();
  const map = useMap();
  const gotFirstFix = useRef(false);
  // Live clock (ticks each minute) so open/closed status stays real-time.
  const nowTs = useNow();

  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null); // [lat, lng]
  const [accuracy, setAccuracy] = useState(null);
  const [locating, setLocating] = useState(false);
  // geoError: null = fine, otherwise { code } describing why we have no fix.
  // code 1 = permission/secure-context, 2 = unavailable, 3 = timeout, 0 = unsupported.
  const [geoError, setGeoError] = useState(null);
  const watchId = useRef(null);
  const userPosRef = useRef(null); // latest fix, read by the error handler

  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [activeCats, setActiveCats] = useState([]); // selected category keys

  // In-map navigation (route drawn on the Amcar map, not an external redirect).
  const [navTarget, setNavTarget] = useState(null);
  const [navInfo, setNavInfo] = useState(null); // { distance, duration, approx }

  const toggleCat = (key) =>
    setActiveCats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const startNavigation = useCallback((m) => {
    setSelected(null); // close the panel so the route is visible
    setNavInfo(null);
    setNavTarget(m);
  }, []);
  const stopNavigation = useCallback(() => {
    setNavTarget(null);
    setNavInfo(null);
  }, []);
  const handleNavInfo = useCallback((info) => setNavInfo(info), []);

  /* ----------------------------- data ----------------------------- */
  useEffect(() => {
    let alive = true;
    mechanicsApi
      .list()
      .then((data) => alive && setMechanics(data))
      .catch(() => alive && setLoadError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  /* ---------------------- real-time geolocation ---------------------- */
  // Geolocation on the web (especially iOS Safari) requires a secure context.
  // localhost is exempt so dev still works over http.
  const supportsGeo =
    typeof navigator !== "undefined" && "geolocation" in navigator;
  const isSecureCtx =
    typeof window !== "undefined" &&
    (window.isSecureContext ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname));

  const onGeoSuccess = useCallback((pos) => {
    const { latitude, longitude, accuracy } = pos.coords;
    setUserPos([latitude, longitude]);
    setAccuracy(accuracy);
    setGeoError(null);
    setLocating(false);
  }, []);

  const onGeoError = useCallback((err) => {
    setLocating(false);
    // Don't wipe a fix we already have; just record why refinement failed.
    setGeoError((prev) =>
      userPosRef.current ? prev : { code: err?.code ?? 2 }
    );
  }, []);

  // Precise, live tracking. Idempotent — a watch is only ever started once.
  const startWatch = useCallback(() => {
    if (!supportsGeo || watchId.current != null) return;
    watchId.current = navigator.geolocation.watchPosition(
      onGeoSuccess,
      onGeoError,
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 27000 }
    );
  }, [supportsGeo, onGeoSuccess, onGeoError]);

  // Two-stage request: an instant coarse fix for perceived speed, then a
  // high-accuracy watch that refines it. Safe to call from a user tap, which
  // is the reliable way to trigger the permission prompt on iOS.
  const requestLocation = useCallback(() => {
    if (!supportsGeo) return setGeoError({ code: 0 });
    if (!isSecureCtx) return setGeoError({ code: 1 });
    setLocating(true);
    // 1) Fast, low-power fix — accepts a cached position, returns near-instantly.
    navigator.geolocation.getCurrentPosition(onGeoSuccess, () => {}, {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 8000,
    });
    // 2) Precise, continuous tracking to sharpen the marker over time.
    startWatch();
  }, [supportsGeo, isSecureCtx, onGeoSuccess, startWatch]);

  // Keep a ref of the latest position so onGeoError can read it without
  // re-subscribing the watch on every fix.
  useEffect(() => {
    userPosRef.current = userPos;
  }, [userPos]);

  useEffect(() => {
    requestLocation();
    return () => {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Center on the user once, as soon as both the map and a fix are available.
  useEffect(() => {
    if (map && userPos && !gotFirstFix.current) {
      gotFirstFix.current = true;
      map.panTo({ lat: userPos[0], lng: userPos[1] });
      map.setZoom(14);
    }
  }, [map, userPos]);

  /* ----------------------------- derived ----------------------------- */
  const now = useMemo(() => new Date(nowTs), [nowTs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cats = MECHANIC_CATEGORIES.filter((c) => activeCats.includes(c.key));
    return mechanics.filter((m) => {
      if (onlyOpen && !getOpenStatus(m, now).open) return false;

      // Category chips (match ANY selected category) — searched against the
      // mechanic's service names + price-list services.
      if (cats.length) {
        const hay = [
          ...(m.services || []),
          ...(m.priceList || []).map((p) => p.service),
        ]
          .join(" ")
          .toLowerCase();
        const ok = cats.some((c) => c.keywords.some((k) => hay.includes(k)));
        if (!ok) return false;
      }

      if (!q) return true;
      return (
        m.name?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q) ||
        m.services?.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [mechanics, query, onlyOpen, activeCats, now]);

  const countText = loading
    ? t.mapUI.loading
    : lang === "en"
    ? `${filtered.length} mechanic${filtered.length === 1 ? "" : "s"}`
    : `${filtered.length} ${t.mapUI.mechanics}`;

  // Stable origin/destination so the route effect only re-runs when the actual
  // coordinates change (not on every unrelated re-render, e.g. navInfo updates).
  const navOrigin = useMemo(
    () => (userPos ? { lat: userPos[0], lng: userPos[1] } : null),
    [userPos]
  );
  const navDest = useMemo(
    () =>
      navTarget?.coordinate
        ? { lat: navTarget.coordinate.latitude, lng: navTarget.coordinate.longitude }
        : null,
    [navTarget]
  );

  /* ----------------------------- actions ----------------------------- */
  const selectMechanic = (m) => {
    setSelected(m);
    if (map && m.coordinate) {
      map.panTo({ lat: m.coordinate.latitude, lng: m.coordinate.longitude });
      if (map.getZoom() < 15) map.setZoom(15);
    }
  };

  const recenter = () => {
    if (userPos && map) {
      map.panTo({ lat: userPos[0], lng: userPos[1] });
      map.setZoom(15);
    } else {
      // No fix yet — this tap is a user gesture, the reliable trigger for the
      // iOS permission prompt.
      requestLocation();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-surface">
      <Map
        key={isDark ? "dark" : "light"}
        mapId={MAP_ID}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        colorScheme={isDark ? "DARK" : "LIGHT"}
        className="size-full"
      >
        {/* User location */}
        {userPos && (
          <>
            <AccuracyCircle center={userPos} radius={accuracy} />
            <AdvancedMarker
              position={{ lat: userPos[0], lng: userPos[1] }}
              title="You are here"
              zIndex={500}
            >
              <div className="guserdot">
                <div className="guserdot__core" />
              </div>
            </AdvancedMarker>
          </>
        )}

        {/* Mechanic markers */}
        {filtered.map((m) => {
          const lat = m.coordinate?.latitude;
          const lng = m.coordinate?.longitude;
          if (typeof lat !== "number" || typeof lng !== "number") return null;
          const openNow = getOpenStatus(m, now).open;
          return (
            <AdvancedMarker
              key={m._id}
              position={{ lat, lng }}
              title={m.name}
              onClick={() => selectMechanic(m)}
            >
              <div
                className={cn(
                  "gpin",
                  !openNow && "gpin--closed",
                  selected?._id === m._id && "gpin--active"
                )}
              >
                <div className="gpin__head">
                  <Wrench strokeWidth={2.25} />
                </div>
                <div className="gpin__tip" />

                {/* Hover preview */}
                <div className="gtip">
                  {m.image ? (
                    <img src={resolveImage(m.image)} alt="" className="gtip__img" />
                  ) : (
                    <div className="gtip__img grid place-items-center">
                      <Wrench className="size-5 text-text-muted" />
                    </div>
                  )}
                  <div>
                    <div className="gtip__name">{m.name}</div>
                    <div className="gtip__meta">
                      <span className="gtip__star">★ {Number(m.rating || 0).toFixed(1)}</span>
                      <span className="gtip__dot">•</span>
                      <span>{m.reviews || 0}</span>
                      <span className="gtip__dot">•</span>
                      <span className={openNow ? "gtip__open" : "gtip__closed"}>
                        {openNow ? t.mapUI.open : t.mapUI.closed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AdvancedMarker>
          );
        })}

        {/* Navigation route, drawn on this map from the user to the mechanic. */}
        {navOrigin && navDest && (
          <DirectionsLayer origin={navOrigin} destination={navDest} onInfo={handleNavInfo} />
        )}
      </Map>

      {/* ---------------- Floating top bar ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 sm:p-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Link
            to="/home"
            className="pointer-events-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-line bg-card/90 pl-3 pr-3.5 font-semibold text-fg shadow-soft backdrop-blur transition-colors hover:border-accent hover:text-accent sm:pr-4"
            aria-label={t.mapUI.home}
            title={t.mapUI.home}
          >
            <Home className="size-5 shrink-0" />
            <span className="text-sm">{t.mapUI.home}</span>
          </Link>

          <div className="pointer-events-auto flex flex-1 items-center gap-2 rounded-2xl border border-line bg-card/90 px-3 shadow-soft backdrop-blur">
            <Search className="size-4 shrink-0 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.mapUI.search}
              className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-text-muted/70"
            />
          </div>

          <button
            onClick={() => setOnlyOpen((v) => !v)}
            className={cn(
              "pointer-events-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold shadow-soft backdrop-blur transition-colors",
              onlyOpen
                ? "border-accent bg-accent text-white"
                : "border-line bg-card/90 text-fg hover:border-ink/30"
            )}
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">{t.mapUI.openNow}</span>
          </button>
        </div>

        {/* Category filter chips */}
        <div className="no-scrollbar mx-auto mt-2 flex max-w-3xl gap-2 overflow-x-auto pb-1">
          {MECHANIC_CATEGORIES.map((c) => {
            const active = activeCats.includes(c.key);
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                onClick={() => toggleCat(c.key)}
                aria-pressed={active}
                className={cn(
                  "pointer-events-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold shadow-soft backdrop-blur transition-colors",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-card/90 text-fg hover:border-ink/30"
                )}
              >
                <Icon className="size-4" /> {t.mapUI.categories[c.key]}
              </button>
            );
          })}
          {activeCats.length > 0 && (
            <button
              onClick={() => setActiveCats([])}
              className="pointer-events-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-card/90 px-3 text-sm font-semibold text-text-muted shadow-soft backdrop-blur transition-colors hover:text-fg"
            >
              <X className="size-4" /> {t.mapUI.clear}
            </button>
          )}
        </div>

        {/* result count */}
        <div className="mx-auto mt-2 max-w-3xl">
          <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Wrench className="size-3.5" />
            {countText}
          </span>
        </div>
      </div>

      {/* ---------------- Recenter button ---------------- */}
      <button
        onClick={recenter}
        className="absolute bottom-6 right-4 z-[1000] grid size-12 place-items-center rounded-2xl border border-line bg-card text-fg shadow-lift transition-colors hover:border-accent hover:text-accent sm:right-[calc(420px+1rem)]"
        aria-label={userPos ? "Recenter on my location" : "Find my location"}
        title={userPos ? "My location" : locating ? "Locating…" : "Find my location"}
      >
        {locating && !userPos ? (
          <Loader2 className="size-5 animate-spin text-accent" />
        ) : (
          <LocateFixed className="size-5" />
        )}
      </button>

      {/* ---------------- States / toasts ---------------- */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[900] grid place-items-center">
          <div className="flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-sm font-medium text-fg shadow-soft backdrop-blur">
            <Loader2 className="size-4 animate-spin text-accent" /> Loading map…
          </div>
        </div>
      )}

      {!loading && !loadError && filtered.length === 0 && mechanics.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-36 z-[900] flex justify-center px-4">
          <span className="rounded-full bg-card/95 px-4 py-2 text-center text-sm font-medium text-fg shadow-soft backdrop-blur">
            {t.mapUI.noResults}
          </span>
        </div>
      )}

      {geoError && !userPos && !loading && (
        <div className="absolute bottom-6 left-4 z-[1000] max-w-xs rounded-2xl border border-line bg-card/95 p-3 text-xs text-text-muted shadow-soft backdrop-blur">
          {geoError.code === 1
            ? isSecureCtx
              ? "Location is blocked. Allow location access for this site in your browser/iOS settings, then tap the locate button."
              : "Location needs a secure (https) connection. Open Amcar over https to see mechanics near you."
            : geoError.code === 3
            ? "Couldn't get a location fix in time — tap the locate button to retry."
            : geoError.code === 0
            ? "This browser doesn't support location."
            : "Location is unavailable right now — tap the locate button to retry."}
        </div>
      )}

      {loadError && !loading && (
        <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lift">
          Couldn't load mechanics. Please try again.
        </div>
      )}

      {/* Navigation banner — shown while a route is active on the map. */}
      {navTarget && (
        <div className="absolute bottom-6 left-1/2 z-[1050] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-card/95 p-3 shadow-lift backdrop-blur">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <Navigation className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-fg">{navTarget.name}</p>
              <p className="truncate text-xs text-text-muted">
                {!userPos
                  ? t.mapUI.navNoLocation
                  : navInfo
                  ? [navInfo.distance, navInfo.duration, navInfo.approx ? t.mapUI.navApprox : null]
                      .filter(Boolean)
                      .join(" · ")
                  : t.mapUI.loading}
              </p>
            </div>
            <button
              onClick={stopNavigation}
              className="shrink-0 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-fg transition-colors hover:border-ink/30"
            >
              {t.mapUI.navExit}
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Detail panel ---------------- */}
      <AnimatePresence>
        {selected && (
          <MechanicDetailPanel
            key={selected._id}
            mechanic={selected}
            onClose={() => setSelected(null)}
            onNavigate={startNavigation}
            onUpdated={(updated) => {
              setSelected(updated);
              setMechanics((list) => list.map((m) => (m._id === updated._id ? updated : m)));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Straight-line distance in km between two {lat,lng} points (haversine). */
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * DirectionsLayer — draws the route from the user to the mechanic ON this map.
 * Prefers the Google Directions API (real driving route + distance/ETA); if
 * that's unavailable (e.g. the Directions API isn't enabled on the key) it
 * falls back to a straight line + straight-line distance, so navigation still
 * happens on the Amcar map and never redirects to Google Maps.
 */
function DirectionsLayer({ origin, destination, onInfo }) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const rendererRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!map || !origin || !destination) return undefined;
    let cancelled = false;

    const clear = () => {
      rendererRef.current?.setMap(null);
      rendererRef.current = null;
      lineRef.current?.setMap(null);
      lineRef.current = null;
    };
    clear();

    const drawStraight = () => {
      const path = [origin, destination];
      lineRef.current = new window.google.maps.Polyline({
        map,
        path,
        strokeColor: "#ff6b00",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 80);
      onInfo?.({ distance: `${haversineKm(origin, destination).toFixed(1)} km`, approx: true });
    };

    if (routesLib) {
      const service = new routesLib.DirectionsService();
      const renderer = new routesLib.DirectionsRenderer({
        map,
        suppressMarkers: true,
        preserveViewport: false,
        polylineOptions: { strokeColor: "#ff6b00", strokeOpacity: 0.95, strokeWeight: 5 },
      });
      rendererRef.current = renderer;
      service.route(
        { origin, destination, travelMode: routesLib.TravelMode.DRIVING },
        (res, status) => {
          if (cancelled) return;
          if (status === "OK" && res) {
            renderer.setDirections(res);
            const leg = res.routes?.[0]?.legs?.[0];
            onInfo?.({ distance: leg?.distance?.text, duration: leg?.duration?.text, approx: false });
          } else {
            renderer.setMap(null);
            rendererRef.current = null;
            drawStraight();
          }
        }
      );
    } else {
      drawStraight();
    }

    return () => {
      cancelled = true;
      clear();
    };
  }, [map, routesLib, origin, destination, onInfo]);

  return null;
}

/** Draws a translucent accuracy circle around the user's position. */
function AccuracyCircle({ center, radius }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !radius || !window.google?.maps) return;
    const circle = new window.google.maps.Circle({
      map,
      center: { lat: center[0], lng: center[1] },
      radius,
      strokeColor: "#2f80ff",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#2f80ff",
      fillOpacity: 0.1,
      clickable: false,
    });
    return () => circle.setMap(null);
  }, [map, center, radius]);
  return null;
}
