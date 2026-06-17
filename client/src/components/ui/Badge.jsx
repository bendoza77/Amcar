import { cn } from "../../lib/utils";

/**
 * Badge — small pill used for eyebrows / section kickers.
 * @param {"accent"|"neutral"|"success"} tone
 */
const TONES = {
  accent: "bg-accent/10 text-accent ring-accent/20",
  neutral: "bg-ink/5 text-ink ring-ink/10",
  success: "bg-success/10 text-success ring-success/20",
};

export default function Badge({ tone = "accent", icon: Icon, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-semibold tracking-tight ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {Icon && <Icon className="size-3.5" strokeWidth={2.5} />}
      {children}
    </span>
  );
}
