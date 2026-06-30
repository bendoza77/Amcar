import { useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { LocateFixed, Wrench } from "lucide-react";
import "../../styles/maps.css";
import { useTheme } from "../../hooks/useTheme";

const TBILISI = { lat: 41.7151, lng: 44.8271 };
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const inputCls =
  "rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg outline-none focus:border-accent";

/** Pans the map whenever the selected position changes (e.g. "use my location"). */
function PanTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (map && position) {
      map.panTo(position);
      if (map.getZoom() < 14) map.setZoom(14);
    }
  }, [map, position]);
  return null;
}

/**
 * LocationPicker — small interactive Google map for the admin form. Clicking
 * anywhere sets the mechanic's coordinate; "Use my location" drops the pin on
 * the admin's current position.
 */
export default function LocationPicker({ value, onChange }) {
  const { isDark } = useTheme();

  const position =
    value && typeof value.latitude === "number" && typeof value.longitude === "number"
      ? { lat: value.latitude, lng: value.longitude }
      : null;

  const pick = (lat, lng) =>
    onChange({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) =>
      pick(pos.coords.latitude, pos.coords.longitude)
    );
  };

  return (
    <div>
      {API_KEY ? (
        <div className="relative h-60 overflow-hidden rounded-xl border border-line">
          <APIProvider apiKey={API_KEY}>
            <Map
              mapId={MAP_ID}
              defaultCenter={position || TBILISI}
              defaultZoom={position ? 14 : 12}
              gestureHandling="greedy"
              disableDefaultUI
              colorScheme={isDark ? "DARK" : "LIGHT"}
              className="size-full"
              onClick={(e) => {
                const ll = e.detail?.latLng;
                if (ll) pick(ll.lat, ll.lng);
              }}
            >
              {position && (
                <AdvancedMarker position={position}>
                  <div className="gpin">
                    <div className="gpin__head">
                      <Wrench strokeWidth={2.25} />
                    </div>
                    <div className="gpin__tip" />
                  </div>
                </AdvancedMarker>
              )}
              <PanTo position={position} />
            </Map>
          </APIProvider>

          <button
            type="button"
            onClick={useMyLocation}
            className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-fg shadow-soft hover:border-accent hover:text-accent"
          >
            <LocateFixed className="size-3.5" /> My location
          </button>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line p-3 text-xs text-text-muted">
          Set <code>VITE_GOOGLE_MAPS_API_KEY</code> to enable the map picker. You can still enter
          coordinates manually below.
        </p>
      )}

      <div className="mt-2 grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          value={value?.latitude ?? ""}
          onChange={(e) => pick(Number(e.target.value || 0), value?.longitude || 0)}
          placeholder="Latitude"
          className={inputCls}
        />
        <input
          type="number"
          step="any"
          value={value?.longitude ?? ""}
          onChange={(e) => pick(value?.latitude || 0, Number(e.target.value || 0))}
          placeholder="Longitude"
          className={inputCls}
        />
      </div>
      <p className="mt-1.5 text-xs text-text-muted">
        Click the map to drop the pin, or type coordinates.
      </p>
    </div>
  );
}
