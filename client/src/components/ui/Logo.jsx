import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

/**
 * Logo — Amcar wordmark with an "A" speed-monogram in the accent tile.
 * The brand name comes from the active locale so it stays consistent.
 *
 * @param {"dark"|"light"} tone   flips colors for light vs. dark backgrounds
 */
export default function Logo({ tone = "dark", className }) {
  const { t } = useTranslation();
  const text = tone === "light" ? "text-white" : "text-ink";

  return (
    <a
      href="#top"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label={`${t.brand} — ${t.nav.about}`}
    >
      <span className="relative grid size-9 place-items-center rounded-xl bg-accent shadow-[0_6px_18px_-6px_rgba(255,107,0,0.7)]">
        <svg viewBox="0 0 128 128" className="size-6" aria-hidden>
          {/* speed streaks */}
          <g fill="#ffffff" opacity="0.55">
            <rect x="14" y="50" width="20" height="7" rx="3.5" />
            <rect x="14" y="62" width="13" height="7" rx="3.5" />
            <rect x="14" y="74" width="7" height="7" rx="3.5" />
          </g>
          {/* forward-leaning "A" */}
          <g
            transform="skewX(-8)"
            stroke="#ffffff"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M52 96 L72 34 L92 96" />
            <path d="M60 74 L84 74" />
          </g>
        </svg>
      </span>
      <span className={cn("text-[1.35rem] font-extrabold tracking-tight", text)}>{t.brand}</span>
    </a>
  );
}
