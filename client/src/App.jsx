import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import LegalPage from "./pages/LegalPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/**
 * App — route table for the Amcar site. Every route renders inside the shared
 * Layout (Navbar + Footer). The home route is the marketing landing page; the
 * legal routes share one templated document page; contact is bespoke.
 */
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
