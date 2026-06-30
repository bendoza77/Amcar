import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Wrench,
  Star,
  MessageSquarePlus,
  Send,
} from "lucide-react";
import Stars from "./Stars";
import { mechanicsApi, resolveImage } from "../../lib/api";

/**
 * MechanicDetailPanel — the full profile of a clicked mechanic. Slides in from
 * the right on desktop and up as a sheet on mobile. Includes a photo gallery,
 * contact + directions actions, services, price list, opening hours, reviews
 * and a review form.
 */
export default function MechanicDetailPanel({ mechanic, userPos, onClose, onUpdated }) {
  const [active, setActive] = useState(0);
  const [showReview, setShowReview] = useState(false);

  if (!mechanic) return null;

  const gallery = mechanic.images?.length ? mechanic.images : mechanic.image ? [mechanic.image] : [];
  const { latitude, longitude } = mechanic.coordinate || {};

  const directionsHref = userPos
    ? `https://www.google.com/maps/dir/?api=1&origin=${userPos[0]},${userPos[1]}&destination=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <motion.aside
      key={mechanic._id}
      initial={{ x: "100%", opacity: 0.4 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="pointer-events-auto absolute inset-x-0 bottom-0 top-auto z-[1100] max-h-[82vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-card shadow-lift sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none sm:rounded-l-3xl"
    >
      {/* Gallery / header */}
      <div className="relative">
        {gallery.length > 0 ? (
          <img
            src={resolveImage(gallery[active])}
            alt={mechanic.name}
            className="h-56 w-full object-cover sm:h-64"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="grid h-56 w-full place-items-center bg-surface text-text-muted sm:h-64">
            <Wrench className="size-12 opacity-40" />
          </div>
        )}

        {/* gradient + close */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* open/closed badge */}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${
            mechanic.isOpen ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
          }`}
        >
          {mechanic.isOpen ? "Open now" : "Closed"}
        </span>

        {/* name overlaid */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-white drop-shadow">
            {mechanic.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <Stars value={mechanic.rating} size={15} />
            <span className="text-sm font-semibold text-white/90">
              {Number(mechanic.rating || 0).toFixed(1)}
            </span>
            <span className="text-sm text-white/70">({mechanic.reviews || 0})</span>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-4 pt-3">
          {gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={resolveImage(src)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6 p-5">
        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            <Navigation className="size-4" /> Directions
          </a>
          {mechanic.phone ? (
            <a
              href={`tel:${mechanic.phone}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-card font-semibold text-fg transition-colors hover:border-ink/30"
            >
              <Phone className="size-4" /> Call
            </a>
          ) : (
            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-surface font-semibold text-text-muted">
              <Phone className="size-4" /> No phone
            </span>
          )}
        </div>

        {/* Address + phone rows */}
        <div className="space-y-3">
          {mechanic.address && (
            <Row icon={MapPin}>{mechanic.address}</Row>
          )}
          {mechanic.phone && <Row icon={Phone}>{mechanic.phone}</Row>}
        </div>

        {/* Services */}
        {mechanic.services?.length > 0 && (
          <Section title="Services" icon={Wrench}>
            <div className="flex flex-wrap gap-2">
              {mechanic.services.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium text-fg"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Price list */}
        {mechanic.priceList?.length > 0 && (
          <Section title="Price list">
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
              {mechanic.priceList.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <span className="text-sm text-fg">{p.service}</span>
                  <span className="text-sm font-bold text-accent">{p.price}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Hours */}
        {mechanic.hours?.length > 0 && (
          <Section title="Opening hours" icon={Clock}>
            <ul className="space-y-1.5">
              {mechanic.hours.map((h, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">{h.day}</span>
                  <span className="font-medium text-fg">{h.time}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Reviews */}
        <Section
          title={`Reviews (${mechanic.comments?.length || 0})`}
          action={
            <button
              onClick={() => setShowReview((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-deep"
            >
              <MessageSquarePlus className="size-4" /> Write
            </button>
          }
        >
          {showReview && (
            <ReviewForm
              mechanicId={mechanic._id}
              onDone={(updated) => {
                setShowReview(false);
                onUpdated?.(updated);
              }}
            />
          )}

          <div className="mt-3 space-y-3">
            {mechanic.comments?.length ? (
              [...mechanic.comments]
                .reverse()
                .map((c, i) => (
                  <div key={i} className="rounded-xl border border-line bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-fg">{c.author || "Anonymous"}</span>
                      <Stars value={c.rating} size={13} />
                    </div>
                    {c.text && <p className="mt-1.5 text-sm text-text-muted">{c.text}</p>}
                    <p className="mt-1 text-xs text-text-muted/70">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-text-muted">No reviews yet — be the first.</p>
            )}
          </div>
        </Section>
      </div>
    </motion.aside>
  );
}

function Row({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
      <span className="text-fg">{children}</span>
    </div>
  );
}

function Section({ title, icon: Icon, action, children }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
          {Icon && <Icon className="size-4" />}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

/** Inline form to post a review; recomputes rating server-side. */
function ReviewForm({ mechanicId, onDone }) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const updated = await mechanicsApi.addComment(mechanicId, { author, rating, text });
      onDone(updated);
    } catch {
      setErr("Could not submit your review. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-line bg-surface p-3">
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
          >
            <Star
              className={`size-6 transition-colors ${
                n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-line"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience…"
        rows={3}
        className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
      >
        <Send className="size-4" /> {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
