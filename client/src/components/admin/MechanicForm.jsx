import { useRef, useState } from "react";
import { Plus, Trash2, X, Camera, Loader2, ArrowLeft } from "lucide-react";
import { resolveImage } from "../../lib/api";
import { uploadMechanicImage } from "../../lib/cloudinary";

const MAX_PHOTOS = 4;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/* ------------------------------ phone helpers ------------------------------ */
// Stored as the local 9-digit number grouped 3 / 3 / 3 ("599 123 456"). Any
// country code (+995 / 995) is stripped when loading older records.
function toLocalDigits(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("995")) d = d.slice(3);
  return d.slice(0, 9);
}
function formatPhone(raw) {
  const d = toLocalDigits(raw);
  return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(" ")
  );
}

/* ------------------------------ hours helpers ------------------------------ */
// A stored hours entry is { day, time } where time is "09:00 – 18:00" or
// "Closed". The form edits it as { day, start, end }.
function parseHour(h) {
  const time = String(h?.time || "").trim();
  if (!time || /^closed$/i.test(time) || /დაკეტ/.test(time)) {
    return { day: h?.day || "", start: "", end: "" };
  }
  const [start = "", end = ""] = time.split(/\s*[–-]\s*/);
  return { day: h?.day || "", start: start.trim(), end: end.trim() };
}
function hourToStored({ day, start, end }) {
  return { day: day.trim(), time: start && end ? `${start} – ${end}` : "Closed" };
}

/* --------------------------------- form ----------------------------------- */
function toForm(m) {
  if (!m) {
    return {
      name: "",
      address: "",
      phone: "",
      images: [],
      latitude: "",
      longitude: "",
      services: [{ service: "", price: "" }],
      hours: [{ day: "", start: "", end: "" }],
      isOpen: true,
    };
  }
  // Prefer priceList (service + price); fall back to the plain services array.
  const services =
    m.priceList?.length
      ? m.priceList.map((p) => ({ service: p.service || "", price: p.price || "" }))
      : m.services?.length
      ? m.services.map((s) => ({ service: s, price: "" }))
      : [{ service: "", price: "" }];
  return {
    name: m.name || "",
    address: m.address || "",
    phone: formatPhone(m.phone),
    images: m.images?.length ? [...m.images] : [],
    latitude: m.coordinate?.latitude != null ? String(m.coordinate.latitude) : "",
    longitude: m.coordinate?.longitude != null ? String(m.coordinate.longitude) : "",
    services: services.length ? services : [{ service: "", price: "" }],
    hours: m.hours?.length ? m.hours.map(parseHour) : [{ day: "", start: "", end: "" }],
    isOpen: m.isOpen ?? true,
  };
}

const label = "text-sm font-semibold text-fg";
const input =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/10";

/**
 * MechanicForm — create/edit a mechanic. Field order & rules mirror the mobile
 * admin panel: Name → Address → Phone → Photos → Latitude+Longitude →
 * Services (service+price) → Working hours → Open-now. Does NOT edit rating,
 * reviews or customer comments.
 */
export default function MechanicForm({ initial, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(() => toForm(initial));
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  /* ----- photos ----- */
  const pickPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file
    if (!files.length) return;
    const room = MAX_PHOTOS - form.images.length;
    const chosen = files.slice(0, room);

    // Validate up front (we upload straight to Firebase Storage, so there's no
    // server multer to reject bad files anymore).
    if (chosen.some((f) => !ALLOWED_TYPES.includes(f.type))) {
      return setErr("Photos must be JPEG, PNG or WebP.");
    }
    if (chosen.some((f) => f.size > MAX_BYTES)) {
      return setErr("Each photo must be 5 MB or smaller.");
    }

    setUploading(true);
    setErr("");
    try {
      // Uploads to the shared Cloudinary account and returns full public URLs —
      // so the mobile app can display them too.
      const urls = [];
      for (const f of chosen) urls.push(await uploadMechanicImage(f));
      set({ images: [...form.images, ...urls].slice(0, MAX_PHOTOS) });
    } catch (e2) {
      setErr(
        e2.message === "CLOUDINARY_NOT_CONFIGURED"
          ? "Image uploads aren't configured yet (set VITE_CLOUDINARY_* in client/.env)."
          : "Photo upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };
  const removeImage = (i) => set({ images: form.images.filter((_, idx) => idx !== i) });

  /* ----- services (service + price) ----- */
  const setService = (i, key, val) =>
    set({ services: form.services.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)) });
  const addService = () => set({ services: [...form.services, { service: "", price: "" }] });
  const removeService = (i) =>
    form.services.length > 1 && set({ services: form.services.filter((_, idx) => idx !== i) });

  /* ----- working hours ----- */
  const setHour = (i, key, val) =>
    set({ hours: form.hours.map((h, idx) => (idx === i ? { ...h, [key]: val } : h)) });
  const addHour = () => set({ hours: [...form.hours, { day: "", start: "", end: "" }] });
  const removeHour = (i) =>
    form.hours.length > 1 && set({ hours: form.hours.filter((_, idx) => idx !== i) });

  const submit = (e) => {
    e.preventDefault();
    setErr("");

    const lat = Number(form.latitude);
    const lng = Number(form.longitude);

    if (!form.name.trim() || form.latitude === "" || form.longitude === "") {
      return setErr("Name, latitude and longitude are required.");
    }
    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return setErr("Latitude must be between -90 and 90, longitude between -180 and 180.");
    }

    const services = form.services.filter((s) => s.service.trim());
    const hours = form.hours.filter((h) => h.day.trim());

    onSubmit({
      name: form.name.trim(),
      address: form.address.trim(),
      phone: toLocalDigits(form.phone) ? formatPhone(form.phone) : "",
      images: form.images,
      coordinate: { latitude: lat, longitude: lng },
      // Save both shapes: priceList for prices, services (names) for the app's filter chips.
      priceList: services.map((s) => ({ service: s.service.trim(), price: s.price.trim() })),
      services: services.map((s) => s.service.trim()),
      hours: hours.map(hourToStored),
      isOpen: form.isOpen,
    });
  };

  return (
    <form onSubmit={submit} className="flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="grid size-9 place-items-center rounded-xl border border-line text-text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" />
          </button>
          <h1 className="text-base font-extrabold tracking-tight text-fg">
            {initial ? "Edit mechanic" : "Add mechanic"}
          </h1>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-4 py-6">
        {/* 1. Name */}
        <Field label="Name *">
          <input
            className={input}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. AutoFix Garage"
          />
        </Field>

        {/* 2. Address */}
        <Field label="Address">
          <input
            className={input}
            value={form.address}
            onChange={(e) => set({ address: e.target.value })}
            placeholder="12 Rustaveli Ave, Tbilisi"
          />
        </Field>

        {/* 3. Phone */}
        <Field label="Phone">
          <input
            className={input}
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => set({ phone: formatPhone(e.target.value) })}
            placeholder="599 123 456"
          />
        </Field>

        {/* 4. Photos */}
        <Field label="Photos">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {form.images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface"
              >
                <img src={resolveImage(src)} alt="" className="size-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/60 text-white hover:bg-red-500"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {form.images.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-line text-text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                    <Camera className="size-5" />
                    Add photo
                  </span>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={pickPhotos}
          />
          <p className="mt-2 text-xs text-text-muted">
            Up to {MAX_PHOTOS} photos, JPEG/PNG/WebP, max 5 MB each. The first photo is the cover.
          </p>
        </Field>

        {/* 5. Latitude + Longitude */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitude *">
            <input
              className={input}
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => set({ latitude: e.target.value })}
              placeholder="41.7151"
            />
          </Field>
          <Field label="Longitude *">
            <input
              className={input}
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => set({ longitude: e.target.value })}
              placeholder="44.8271"
            />
          </Field>
        </div>

        {/* 6. Services (service + price) */}
        <Field label="Services">
          <div className="space-y-2">
            {form.services.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={input}
                  value={s.service}
                  onChange={(e) => setService(i, "service", e.target.value)}
                  placeholder="სერვისი (ქართულად)"
                />
                <input
                  className={`${input} max-w-[35%]`}
                  value={s.price}
                  onChange={(e) => setService(i, "price", e.target.value)}
                  placeholder="₾ ფასი"
                />
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  disabled={form.services.length === 1}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-text-muted hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <AddBtn onClick={addService}>Add service</AddBtn>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Enter service names in Georgian so the app's filter chips match.
          </p>
        </Field>

        {/* 7. Working hours */}
        <Field label="Working hours">
          <div className="space-y-2">
            {form.hours.map((h, i) => (
              <div key={i} className="rounded-xl border border-line p-3">
                <div className="flex items-center gap-2">
                  <input
                    className={input}
                    value={h.day}
                    onChange={(e) => setHour(i, "day", e.target.value)}
                    placeholder="Day (e.g. Mon–Fri)"
                  />
                  <button
                    type="button"
                    onClick={() => removeHour(i)}
                    disabled={form.hours.length === 1}
                    className="grid size-9 shrink-0 place-items-center rounded-lg text-text-muted hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    className={input}
                    type="time"
                    value={h.start}
                    onChange={(e) => setHour(i, "start", e.target.value)}
                  />
                  <span className="text-text-muted">–</span>
                  <input
                    className={input}
                    type="time"
                    value={h.end}
                    onChange={(e) => setHour(i, "end", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <AddBtn onClick={addHour}>Add day</AddBtn>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            A day with no times is saved as “Closed”.
          </p>
        </Field>

        {/* 8. Open now */}
        <div className="flex items-center justify-between rounded-xl border border-line p-4">
          <span className={label}>Open now</span>
          <button
            type="button"
            onClick={() => set({ isOpen: !form.isOpen })}
            className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors ${
              form.isOpen ? "bg-emerald-500" : "bg-line"
            }`}
            role="switch"
            aria-checked={form.isOpen}
          >
            <span
              className={`size-7 rounded-full bg-white shadow transition-transform ${
                form.isOpen ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        {err && <p className="text-sm font-medium text-red-500">{err}</p>}
      </div>

      {/* Fixed Save footer */}
      <footer className="sticky bottom-0 border-t border-line bg-card/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            type="submit"
            disabled={busy || uploading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-5 animate-spin" /> : "Save"}
          </button>
        </div>
      </footer>
    </form>
  );
}

function Field({ label: lbl, children }) {
  return (
    <label className="block">
      <span className={label}>{lbl}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function AddBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <Plus className="size-4" /> {children}
    </button>
  );
}
