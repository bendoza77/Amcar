import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import AppShowcase from "../components/sections/AppShowcase";
import HowItWorks from "../components/sections/HowItWorks";
import Benefits from "../components/sections/Benefits";
import Testimonials from "../components/sections/Testimonials";
import DownloadCTA from "../components/sections/DownloadCTA";
import FAQ from "../components/sections/FAQ";

/**
 * Home — the marketing landing page. Sections are ordered for conversion:
 * hook → value → product → proof → CTA.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <AppShowcase />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <DownloadCTA />
      <FAQ />
    </>
  );
}
