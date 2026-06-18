import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/useTranslation";
import { LANGS } from "../../i18n/dictionary";
import { cn } from "../../lib/utils";

/**
 * LanguageToggle — compact ქარ / EN segmented switch with a sliding pill.
 * `tone="light"` adapts it for dark backgrounds (e.g. mobile menu / footer).
 */
export default function LanguageToggle({ tone = "dark", className }) {
  const { lang, setLang, t } = useTranslation();
  const light = tone === "light";

  return (
    <div
      role="group"
      aria-label={t.a11y.switchLang}
      className={cn(
        "relative inline-flex rounded-full p-0.5 ring-1",
        light ? "bg-white/10 ring-white/15" : "bg-ink/5 ring-ink/10",
        className
      )}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 min-w-[2.75rem] rounded-full px-3 py-1.5 text-small font-semibold transition-colors",
              active
                ? "text-white"
                : light
                  ? "text-white/60 hover:text-white"
                  : "text-text-muted hover:text-fg"
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-accent"
              />
            )}
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
