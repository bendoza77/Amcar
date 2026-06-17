import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import logoImage from "../../assets/WhatsApp_Image_2026-06-16_at_12.44.29_PM__1_-removebg-preview.png";

/**
 * Logo — Amcar brand logo image.
 *
 * @param {"dark"|"light"} tone   kept for API compatibility (no visual effect)
 */
export default function Logo({ tone = "dark", className }) {
  const { t } = useTranslation();

  return (
    <a href="#top" className={cn("inline-flex items-center", className)} aria-label={t.brand}>
      <img src={logoImage} alt={t.brand} className="-my-4 h-28 w-auto object-contain" />
    </a>
  );
}
