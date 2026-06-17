import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import logoDark from "../../assets/Screenshot_2026-06-17_144756-removebg-preview.png";
import logoLight from "../../assets/Screenshot_2026-06-17_153655-removebg-preview.png";

/**
 * Logo — Amcar brand logo image. Uses the light-mode artwork on dark
 * backgrounds (e.g. the footer) and the standard one elsewhere.
 *
 * @param {"dark"|"light"} tone   "light" = for use on dark backgrounds
 */
export default function Logo({ tone = "dark", className }) {
  const { t } = useTranslation();
  const logoImage = tone === "light" ? logoLight : logoDark;

  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label={t.brand}>
      <img
        src={logoImage}
        alt={`${t.brand} logo`}
        height={48}
        loading="eager"
        decoding="async"
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}
