import { useState } from "react";
import { Plus, Trash2, X, ImageIcon } from "lucide-react";
import LocationPicker from "./LocationPicker";
import { resolveImage } from "../../lib/api";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyForm = {
  name: "",
  isOpen: true,
  rating: 0,
  reviews: 0,
  address: "",
  phone: "",
  images: [""],
  services: [],
  priceList: [{ service: "", price: "" }],
  hours: DAYS.map((d) => ({ day: d, time: "" })),
  coordinate: null,
};

/** Normalises a mechanic doc from the API into editable form state. */
function toForm(m) {
  if (!m) return structuredClone(emptyForm);
  return {
    name: m.name || "",
    isOpen: m.isOpen ?? true,
    rating: m.rating || 0,
    reviews: m.reviews || 0,
    address: m.address || "",
    phone: m.phone || "",
    images: m.images?.length ? [...m.images] : [""],
    services: m.services || [],
    priceList: m.priceList?.length ? m.priceList.map((p) => ({ ...p })) : [{ service: "", price: "" }],
    hours: m.hours?.length ? m.hours.map((h) => ({ ...h })) : DAYS.map((d) => ({ day: d, time: "" })),
    coordinate: m.coordinate || null,
  };
}

const label = "text-sm font-semibold text-fg";
const input =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/10";

/**
 * MechanicForm — create/edit a mechanic across the full schema: identity,
 * status, gallery (image URLs), services, price list, opening hours and the
 * map coordinate. Calls onSubmit(payload).
 */
export default function MechanicForm({ initial, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(() => toForm(initial));
  const [serviceDraft, setServiceDraft] = useState("");
  const [err, setErr] = useState("");

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  /* ----- images ----- */
  const setImage = (i, val) =>
    set({ images: form.images.map((s, idx) => (idx === i ? val : s)) });
  const addImage = () => form.images.length < 4 && set({ images: [...form.images, ""] });
  const removeImage = (i) => set({ images: form.images.filter((_, idx) => idx !== i) });

  /* ----- services ----- */
  const addService = () => {
    const v = serviceDraft.trim();
    if (v && !form.services.includes(v)) set({ services: [...form.services, v] });
    setServiceDraft("");
  };
  const removeService = (s) => set({ services: form.services.filter((x) => x !== s) });

  /* ----- price list ----- */
  const setPrice = (i, key, val) =>
    set({ priceList: form.priceList.map((p, idx) => (idx === i ? { ...p, [key]: val } : p)) });
  const addPrice = () => set({ priceList: [...form.priceList, { service: "", price: "" }] });
  const removePrice = (i) => set({ priceList: form.priceList.filter((_, idx) => idx !== i) });

  /* ----- hours ----- */
  const setHour = (i, val) =>
    set({ hours: form.hours.map((h, idx) => (idx === i ? { ...h, time: val } : h)) });

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim()) return setErr("Name is required.");
    if (
      !form.coordinate ||
      typeof form.coordinate.latitude !== "number" ||
      typeof form.coordinate.longitude !== "number"
    ) {
      return setErr("Pick a location on the map.");
    }

    onSubmit({
      name: form.name.trim(),
      isOpen: form.isOpen,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      address: form.address.trim(),
      phone: form.phone.trim(),
      images: form.images.map((s) => s.trim()).filter(Boolean),
      services: form.services,
      priceList: form.priceList.filter((p) => p.service || p.price),
      hours: form.hours.filter((h) => h.time),
      coordinate: form.coordinate,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Identity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name *">
          <input
            className={input}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. AutoFix Garage"
          />
        </Field>
        <Field label="Phone">
          <input
            className={input}
            value={form.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+995 5xx xx xx xx"
          />
        </Field>
      </div>

      <Field label="Address">
        <input
          className={input}
          value={form.address}
          onChange={(e) => set({ address: e.target.value })}
          placeholder="Street, city"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Open now">
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
        </Field>
        <Field label="Rating (0–5)">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className={input}
            value={form.rating}
            onChange={(e) => set({ rating: e.target.value })}
          />
        </Field>
        <Field label="Reviews count">
          <input
            type="number"
            min="0"
            className={input}
            value={form.reviews}
            onChange={(e) => set({ reviews: e.target.value })}
          />
        </Field>
      </div>

      {/* Gallery */}
      <Field label={`Photos (URLs, up to 4) — first is the cover`}>
        <div className="space-y-2">
          {form.images.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
                {url ? (
                  <img src={resolveImage(url)} alt="" className="size-full object-cover" />
                ) : (
                  <ImageIcon className="size-4 text-text-muted" />
                )}
              </span>
              <input
                className={input}
                value={url}
                onChange={(e) => setImage(i, e.target.value)}
                placeholder="https://…/photo.jpg"
              />
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)} className="text-text-muted hover:text-red-500">
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
          {form.images.length < 4 && (
            <AddBtn onClick={addImage}>Add photo</AddBtn>
          )}
        </div>
      </Field>

      {/* Services */}
      <Field label="Services">
        <div className="flex flex-wrap gap-2">
          {form.services.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              {s}
              <button type="button" onClick={() => removeService(s)}>
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className={input}
            value={serviceDraft}
            onChange={(e) => setServiceDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addService();
              }
            }}
            placeholder="e.g. Oil change, then Enter"
          />
          <AddBtn onClick={addService} inline>Add</AddBtn>
        </div>
      </Field>

      {/* Price list */}
      <Field label="Price list">
        <div className="space-y-2">
          {form.priceList.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                value={p.service}
                onChange={(e) => setPrice(i, "service", e.target.value)}
                placeholder="Service"
              />
              <input
                className={`${input} max-w-[40%]`}
                value={p.price}
                onChange={(e) => setPrice(i, "price", e.target.value)}
                placeholder="₾ Price"
              />
              <button type="button" onClick={() => removePrice(i)} className="text-text-muted hover:text-red-500">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <AddBtn onClick={addPrice}>Add price row</AddBtn>
        </div>
      </Field>

      {/* Hours */}
      <Field label="Opening hours">
        <div className="grid gap-2 sm:grid-cols-2">
          {form.hours.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-10 text-sm font-semibold text-text-muted">{h.day}</span>
              <input
                className={input}
                value={h.time}
                onChange={(e) => setHour(i, e.target.value)}
                placeholder="09:00–18:00 / Closed"
              />
            </div>
          ))}
        </div>
      </Field>

      {/* Location */}
      <Field label="Location *">
        <LocationPicker value={form.coordinate} onChange={(c) => set({ coordinate: c })} />
      </Field>

      {err && <p className="text-sm font-medium text-red-500">{err}</p>}

      {/* Actions */}
      <div className="flex gap-3 border-t border-line pt-4">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
        >
          {busy ? "Saving…" : initial ? "Save changes" : "Create mechanic"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-5 font-semibold text-fg transition-colors hover:border-ink/30"
        >
          Cancel
        </button>
      </div>
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

function AddBtn({ onClick, children, inline }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-accent hover:text-accent ${
        inline ? "shrink-0" : ""
      }`}
    >
      <Plus className="size-4" /> {children}
    </button>
  );
}
