import { useEffect, useMemo, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, LocateFixed, Wrench, Loader2, SlidersHorizontal } from "lucide-react";
import "../styles/maps.css";

import { useTheme } from "../hooks/useTheme";
import { mechanicsApi, resolveImage } from "../lib/api";
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
          <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-accent">
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
  const map = useMap();
  const gotFirstFix = useRef(false);

  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selected, setSelected] = useState(null);
  const [userPos, setUserPos] = useState(null); // [lat, lng]
  const [accuracy, setAccuracy] = useState(null);
  const [geoDenied, setGeoDenied] = useState(
    () => typeof navigator !== "undefined" && !("geolocation" in navigator)
  );

  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);

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
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPos([latitude, longitude]);
        setAccuracy(accuracy);
        setGeoDenied(false);
      },
      () => setGeoDenied(true),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
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
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mechanics.filter((m) => {
      if (onlyOpen && !m.isOpen) return false;
      if (!q) return true;
      return (
        m.name?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q) ||
        m.services?.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [mechanics, query, onlyOpen]);

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
                  !m.isOpen && "gpin--closed",
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
                      <span className={m.isOpen ? "gtip__open" : "gtip__closed"}>
                        {m.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* ---------------- Floating top bar ---------------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 sm:p-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Link
            to="/"
            className="pointer-events-auto grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-card/90 text-fg shadow-soft backdrop-blur transition-colors hover:border-ink/30"
            aria-label="Back home"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div className="pointer-events-auto flex flex-1 items-center gap-2 rounded-2xl border border-line bg-card/90 px-3 shadow-soft backdrop-blur">
            <Search className="size-4 shrink-0 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mechanics, services, area…"
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
            <span className="hidden sm:inline">Open now</span>
          </button>
        </div>

        {/* result count */}
        <div className="mx-auto mt-2 max-w-3xl">
          <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Wrench className="size-3.5" />
            {loading ? "Loading…" : `${filtered.length} mechanic${filtered.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

      {/* ---------------- Recenter button ---------------- */}
      <button
        onClick={recenter}
        disabled={!userPos}
        className="absolute bottom-6 right-4 z-[1000] grid size-12 place-items-center rounded-2xl border border-line bg-card text-fg shadow-lift transition-colors hover:border-accent hover:text-accent disabled:opacity-50 sm:right-[calc(420px+1rem)]"
        aria-label="Recenter on my location"
        title={userPos ? "My location" : "Locating…"}
      >
        <LocateFixed className="size-5" />
      </button>

      {/* ---------------- States / toasts ---------------- */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[900] grid place-items-center">
          <div className="flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-sm font-medium text-fg shadow-soft backdrop-blur">
            <Loader2 className="size-4 animate-spin text-accent" /> Loading map…
          </div>
        </div>
      )}

      {geoDenied && !loading && (
        <div className="absolute bottom-6 left-4 z-[1000] max-w-xs rounded-2xl border border-line bg-card/95 p-3 text-xs text-text-muted shadow-soft backdrop-blur">
          Location access is off — enable it in your browser to see mechanics near you.
        </div>
      )}

      {loadError && !loading && (
        <div className="absolute bottom-6 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lift">
          Couldn't load mechanics. Please try again.
        </div>
      )}

      {/* ---------------- Detail panel ---------------- */}
      <AnimatePresence>
        {selected && (
          <MechanicDetailPanel
            key={selected._id}
            mechanic={selected}
            userPos={userPos}
            onClose={() => setSelected(null)}
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
