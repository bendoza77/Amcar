import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Card — surface primitive with optional hover interaction.
 * `interactive` adds the premium lift + border-glow used on feature cards.
 * `glass` switches to the frosted variant used on testimonials.
 */
export default function Card({
  interactive = false,
  glass = false,
  className,
  children,
  ...props
}) {
  return (
    <motion.div
      whileHover={
        interactive
          ? { y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }
          : undefined
      }
      className={cn(
        "group relative rounded-3xl p-7",
        glass
          ? "glass border border-white/60 shadow-soft"
          : "border border-line bg-white shadow-soft",
        interactive &&
          "transition-shadow duration-300 hover:border-accent/30 hover:shadow-lift",
        className
      )}
      {...props}
    >
      {/* Accent glow ring revealed on hover */}
      {interactive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 ring-1 ring-accent/40 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
    </motion.div>
  );
}
