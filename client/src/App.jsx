import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Layout from "./components/layout/Layout";
import MapPage from "./pages/MapPage";

// Route-level code splitting: the map is the front door, so it ships in the
// main bundle; everything else loads on demand. This keeps first paint of "/"
// from paying for the landing page, admin panel, legal docs, etc.
const Home = lazy(() => import("./pages/Home"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));

/** Minimal, theme-aware splash shown while a lazy route chunk downloads. */
function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface">
      <div className="size-8 animate-spin rounded-full border-2 border-line border-t-accent" />
    </div>
  );
}

/**
 * App — route table for the Amcar site. The map is the front door ("/"): it's
 * the product's core function, so first-time visitors land straight on it. The
 * marketing landing page lives at "/home"; legal routes share one templated
 * document page; contact is bespoke. Full-screen pages (map, admin) render
 * outside the shared Layout (no navbar/footer).
 */
export default function App() {
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Full-screen pages render outside the shared Layout (no navbar/footer). */}
          <Route path="/" element={<MapPage />} />
          <Route path="/map" element={<MapPage />} />
          {/* Admin lives at an obscure, unadvertised path (kept out of robots.txt
              and the sitemap on purpose). */}
          <Route path="/amcar-best-panel" element={<Admin />} />

          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/privacy" element={<LegalPage docKey="privacy" />} />
            <Route path="/terms" element={<LegalPage docKey="terms" />} />
            <Route path="/cookies" element={<LegalPage docKey="cookies" />} />
            <Route path="/licenses" element={<LegalPage docKey="licenses" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
