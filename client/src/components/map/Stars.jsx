import { Star } from "lucide-react";

/**
 * Stars — five-star rating display with fractional fill via a clipped overlay.
 * @param {number} value 0–5
 * @param {number} size px
 */
export default function Stars({ value = 0, size = 16, className = "" }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={`relative inline-flex ${className}`}
      style={{ width: size * 5 + 8 }}
      aria-label={`${value} out of 5 stars`}
    >
      {/* empty track */}
      <span className="flex gap-0.5 text-line">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} style={{ width: size, height: size }} className="fill-current" />
        ))}
      </span>
      {/* filled overlay clipped to pct */}
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size, minWidth: size }}
            className="fill-current"
          />
        ))}
      </span>
    </span>
  );
}
