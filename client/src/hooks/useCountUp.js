import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * useCountUp — animates a number from 0 to `end` once it scrolls into view.
 * Returns a ref to attach to the element and the current animated value.
 *
 * @param {number} end       target value
 * @param {number} duration  animation length in ms
 */
export function useCountUp(end, duration = 1600) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    let start = null;

    const tick = (now) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return { ref, value };
}
