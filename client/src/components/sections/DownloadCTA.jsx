import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Container from "../layout/Container";
import StoreButtons from "../ui/StoreButtons";
import PhoneMockup from "../ui/PhoneMockup";
import { useTranslation } from "../../hooks/useTranslation";
import { fadeUp, fadeLeft, staggerContainer, viewportOnce } from "../../lib/motion";

/**
 * DownloadCTA — the massive closing conversion section. A dark, glowing panel
 * pairs a confident headline + store badges with a large phone mockup.
 */
export default function DownloadCTA() {
  const { t } = useTranslation();
  return (
    <section id="download" className="px-5 py-16 lg:py-24">
      <Container size="wide" className="px-0">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-white sm:px-12 lg:px-20 lg:py-20">
          {/* Background FX */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />
            <div className="glow-blob absolute -right-10 -top-20 size-[420px] animate-drift rounded-full opacity-40" />
            <div className="absolute -bottom-24 left-1/4 size-80 rounded-full bg-accent/25 blur-[120px]" />
          </div>

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <motion.h2 variants={fadeUp} className="text-hero font-extrabold tracking-tight text-balance">
                {t.cta.title}
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-6 max-w-md text-body-lg text-white/65">
                {t.cta.description}
              </motion.p>

              <motion.ul variants={fadeUp} className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                {t.cta.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-[0.975rem] font-medium text-white/90">
                    <span className="grid size-5 place-items-center rounded-full bg-success/20 text-success">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    {perk}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-9">
                <StoreButtons tone="light" />
              </motion.div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={viewportOnce} className="relative flex justify-center lg:justify-end">
              <PhoneMockup screen="home" float />
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
