import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import logoImage from "../../assets/Screenshot_2026-06-17_144756-removebg-preview.png";

/**
 * Logo — Amcar brand logo image.
 *
 * @param {"dark"|"light"} tone   kept for API compatibility (no visual effect)
 */
export default function Logo({ tone = "dark", className }) {
  const { t } = useTranslation();

  return (
    <a href="#top" className={cn("inline-flex items-center", className)} aria-label={t.brand}>
      <img src={logoImage} alt={t.brand} className="h-12 w-auto object-contain" />
    </a>
  );
}
