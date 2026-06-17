/**
 * Motion presets — a small, shared vocabulary of Framer Motion variants.
 * Centralizing them keeps animations consistent and easy to tune globally.
 *
 * Usage:
 *   <motion.div variants={fadeUp} initial="hidden" whileInView="show" />
 *   <motion.ul variants={staggerContainer}> ... </motion.ul>
 */

const EASE = [0.16, 1, 0.3, 1]; // expo-out, matches --ease-out-expo

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Parent container that staggers its children's reveal. */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Shared viewport config so reveals trigger once, slightly before fully visible. */
export const viewportOnce = { once: true, amount: 0.25 };

/** Variant lookup so components can accept a string prop. */
export const variantMap = {
  fadeUp,
  fadeIn,
  scaleIn,
  fadeLeft,
  fadeRight,
};
