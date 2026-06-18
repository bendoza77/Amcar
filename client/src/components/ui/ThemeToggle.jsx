import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

/**
 * ThemeToggle — round icon button that flips light/dark. The sun/moon icons
 * cross-fade with a small rotation. `tone="light"` adapts it for dark
 * backgrounds (e.g. the footer or mobile menu).
 */
export default function ThemeToggle({ tone = "dark", className }) {
  const { isDark, toggle } = useTheme();
  const { t } = useTranslation();
  const light = tone === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.a11y.toggleTheme}
      aria-pressed={isDark}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full ring-1 transition-colors",
        light
          ? "bg-white/10 text-white ring-white/15 hover:bg-white/15"
          : "bg-ink/5 text-fg ring-ink/10 hover:bg-ink/10",
        className
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 14, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
