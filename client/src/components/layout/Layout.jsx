import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * ScrollManager — keeps scroll behaviour sane across client-side navigation.
 * Jumps to the top on a route change, or smooth-scrolls to a `#section`
 * when the destination carries a hash (e.g. navigating to "/#features").
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section is mounted before scrolling.
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        window.scrollTo(0, 0);
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

/**
 * Layout — shared chrome (Navbar + Footer) wrapped around every route via the
 * router <Outlet />. The fixed navbar floats over each page's own top spacing.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollManager />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
