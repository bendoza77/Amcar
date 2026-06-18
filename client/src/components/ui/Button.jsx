import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const MotionLink = motion.create(Link);

/**
 * Button — the single button component for the whole site.
 * Renders as a react-router <Link> when `to` is passed, an <a> when `href`
 * is passed, otherwise a <button>. Motion adds a subtle press + hover lift.
 *
 * @param {"primary"|"secondary"|"ghost"|"dark"} variant
 * @param {"sm"|"md"|"lg"} size
 */
const VARIANTS = {
  primary:
    "bg-accent text-white shadow-[0_8px_24px_-8px_rgba(255,107,0,0.6)] hover:bg-accent-deep",
  secondary:
    "bg-card text-fg border border-line hover:border-ink/30 hover:shadow-soft",
  dark: "bg-ink text-white hover:bg-ink-soft",
  ghost: "bg-transparent text-fg hover:bg-ink/5",
};

const SIZES = {
  sm: "h-10 px-4 text-small gap-1.5",
  md: "h-12 px-6 text-[0.95rem] gap-2",
  lg: "h-14 px-8 text-body-lg gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  to,
  icon: Icon,
  iconRight = false,
  className,
  children,
  ...props
}) {
  const Comp = to ? MotionLink : href ? motion.a : motion.button;
  const linkProps = to ? { to } : href ? { href } : {};

  return (
    <Comp
      {...linkProps}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex select-none items-center justify-center rounded-full font-semibold tracking-tight transition-colors duration-200 will-change-transform",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && !iconRight && <Icon className="size-[1.15em]" strokeWidth={2.25} />}
      {children}
      {Icon && iconRight && <Icon className="size-[1.15em]" strokeWidth={2.25} />}
    </Comp>
  );
}
