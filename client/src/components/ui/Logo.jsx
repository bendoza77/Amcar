import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../hooks/useTheme";
import logoDark from "../../assets/Screenshot_2026-06-17_144756-removebg-preview.png";
import logoLight from "../../assets/Screenshot_2026-06-17_153655-removebg-preview.png";

/**
 * Logo — Amcar brand logo image. Uses the light-mode artwork on dark
 * backgrounds. When `tone` is omitted it follows the active color theme
 * (light artwork in dark mode); pass an explicit tone to force one — e.g.
 * the footer is always dark, so it passes `tone="light"`.
 *
 * @param {"dark"|"light"} [tone]   "light" = artwork for dark backgrounds
 */
export default function Logo({ tone, className }) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const resolvedTone = tone ?? (isDark ? "light" : "dark");
  const isLight = resolvedTone === "light";
  const logoImage = isLight ? logoLight : logoDark;

  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label={t.brand}>
      {/* The two artworks have different aspect ratios/padding, so we constrain
          by width (not height) — that keeps the wordmark the same visual size
          in both light and dark themes. */}
      <img
        src={logoImage}
        alt={`${t.brand} logo`}
        width={130}
        height={isLight ? 39 : 48}
        loading="eager"
        decoding="async"
        className="h-auto w-[130px] object-contain"
      />
    </Link>
  );
}
