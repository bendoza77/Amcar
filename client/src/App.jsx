import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import LegalPage from "./pages/LegalPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";

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
      <Analytics />
      <SpeedInsights />
    </>
  );
}
