import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";
import { SITE } from "../../constants/site";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

/**
 * StoreBadge — App Store / Google Play download button styled as a real badge.
 */
function StoreBadge({ href, icon: Icon, top, bottom, tone = "dark" }) {
  const dark = tone === "dark";
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-colors",
        dark
          ? "bg-ink text-white hover:bg-ink-soft"
          : "border border-line bg-white text-ink hover:border-ink/30"
      )}
    >
      <Icon className="size-7" />
      <span className="text-left leading-tight">
        <span className="block text-[11px] font-medium opacity-70">{top}</span>
        <span className="block text-[1.05rem] font-bold tracking-tight">{bottom}</span>
      </span>
    </motion.a>
  );
}

/**
 * StoreButtons — the App Store + Google Play pair, reused across the site.
 */
export default function StoreButtons({ tone = "dark", className }) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <StoreBadge
        href={SITE.appStoreUrl}
        icon={Apple}
        top={t.store.appStoreTop}
        bottom={t.store.appStoreBottom}
        tone={tone}
      />
      <StoreBadge
        href={SITE.playStoreUrl}
        icon={Play}
        top={t.store.playTop}
        bottom={t.store.playBottom}
        tone={tone}
      />
    </div>
  );
}
