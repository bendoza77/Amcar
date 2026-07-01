import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import AppShowcase from "../components/sections/AppShowcase";
import HowItWorks from "../components/sections/HowItWorks";
import Benefits from "../components/sections/Benefits";
import DownloadCTA from "../components/sections/DownloadCTA";
import FAQ from "../components/sections/FAQ";
import Seo from "../seo/Seo";
import { getRoute } from "../seo/siteMeta";
import { appSchema, faqSchema } from "../seo/structuredData";
import { useTranslation } from "../hooks/useTranslation";

/**
 * Home — the marketing landing page. Sections are ordered for conversion:
 * hook → value → product → CTA.
 *
 * SEO: the pillar page. Organization + WebSite live globally in index.html;
 * here we layer in the MobileApplication and FAQPage nodes, with the FAQ
 * schema built from the same localized items the FAQ section renders.
 */
export default function Home() {
  const { t, lang } = useTranslation();
  const m = getRoute("/").meta[lang];

  const jsonLd = [
    appSchema(), // aggregateRating intentionally omitted until real store data
    faqSchema(t.faq.items),
  ];

  return (
    <>
      <Seo
        title={m.title}
        description={m.description}
        keywords={m.keywords}
        path="/home"
        lang={lang}
        ogType="website"
        jsonLd={jsonLd}
      />
      <Hero />
      <Features />
      <AppShowcase />
      <HowItWorks />
      <Benefits />
      <DownloadCTA />
      <FAQ />
    </>
  );
}
