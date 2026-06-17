import { motion } from "framer-motion";
import { variantMap, viewportOnce } from "../../lib/motion";

/**
 * AnimatedContainer — declarative scroll-reveal wrapper.
 * Pass a named variant ("fadeUp", "scaleIn", ...) and it animates the element
 * into view once. Set `stagger` to coordinate child reveals (children should
 * use <AnimatedContainer.Item />).
 *
 * @param {keyof typeof variantMap} variant
 * @param {number} delay   seconds to delay the reveal
 */
export default function AnimatedContainer({
  variant = "fadeUp",
  as = "div",
  delay = 0,
  className,
  children,
  ...props
}) {
  const MotionTag = motion[as] || motion.div;
  const selected = variantMap[variant] || variantMap.fadeUp;

  return (
    <MotionTag
      variants={selected}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
