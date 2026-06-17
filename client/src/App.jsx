import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Features from "./components/sections/Features";
import AppShowcase from "./components/sections/AppShowcase";
import HowItWorks from "./components/sections/HowItWorks";
import Benefits from "./components/sections/Benefits";
import Testimonials from "./components/sections/Testimonials";
import DownloadCTA from "./components/sections/DownloadCTA";
import FAQ from "./components/sections/FAQ";

/**
 * App — top-level page composition for the ხოდზე marketing site.
 * Sections are ordered for conversion: hook → value → product → proof → CTA.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AppShowcase />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <DownloadCTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
