import { useEffect, useState } from "react";

/**
 * useScrollPosition — reports whether the page has scrolled past a threshold.
 * Used by the Navbar to switch from transparent to a glassmorphism bar.
 *
 * @param {number} threshold  pixels scrolled before `scrolled` flips to true
 * @returns {{ scrolled: boolean, y: number }}
 */
export function useScrollPosition(threshold = 24) {
  const [state, setState] = useState({ scrolled: false, y: 0 });

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      // rAF throttle — avoids layout thrash on rapid scroll events
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setState({ scrolled: y > threshold, y });
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return state;
}
