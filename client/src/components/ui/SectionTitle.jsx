import { motion } from "framer-motion";
import Badge from "./Badge";
import { fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";
import { cn } from "../../lib/utils";

/**
 * SectionTitle — consistent section header: optional eyebrow badge,
 * a display title, and a supporting line. Reveals with a staggered fade.
 *
 * @param {string} eyebrow   small kicker label
 * @param {string} title     main display heading
 * @param {string} subtitle  supporting paragraph
 * @param {"left"|"center"} align
 */
export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "accent",
  className,
}) {
  const isCenter = align === "center";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn(
        "flex flex-col gap-4",
        isCenter ? "items-center text-center" : "items-start text-left",
        isCenter && "mx-auto max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <motion.div variants={fadeUp}>
          <Badge tone={tone}>{eyebrow}</Badge>
        </motion.div>
      )}

      <motion.h2
        variants={fadeUp}
        className="text-display font-extrabold text-ink text-balance"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="text-body-lg text-text-muted text-pretty max-w-xl"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
