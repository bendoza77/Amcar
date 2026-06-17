import { motion } from "framer-motion";
import { PlayCircle, Play, Star, Sparkles } from "lucide-react";
import Container from "../layout/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import PhoneMockup from "../ui/PhoneMockup";
import { useTranslation } from "../../hooks/useTranslation";
import { fadeUp, fadeLeft, staggerContainer } from "../../lib/motion";

/**
 * Hero — full-screen opener. Left: headline + CTAs + social proof.
 * Right: floating 3D-tilted phone with a live-looking map screen.
 * Background layers: animated gradient glow, dotted grid, spotlight.
 */
export default function Hero() {
  const { t, lang } = useTranslation();
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* ---- Background layers ---- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-spotlight" />
        <div className="glow-blob absolute -right-20 -top-10 size-[420px] animate-drift rounded-full" />
        <div className="glow-blob absolute -left-24 top-40 size-[360px] animate-drift rounded-full [animation-delay:-6s] opacity-30" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-8">
          {/* ---- Copy ---- */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-xl">
            <motion.div variants={fadeUp}>
              <Badge tone="accent" icon={Sparkles}>
                {t.hero.badge}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-hero font-extrabold text-ink text-balance"
              /* Georgian glyphs have tall ascenders/descenders — loosen the
                 leading so stacked lines don't collide. */
              style={lang === "ka" ? { lineHeight: 1.18 } : undefined}
            >
              {t.hero.titleBefore}
              <span className="text-gradient">{t.hero.titleHighlight}</span>
              {t.hero.titleAfter}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-body-lg text-text-muted text-pretty"
            >
              {t.hero.description}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" href="#download" icon={Play}>
                {t.hero.downloadApp}
              </Button>
              <Button variant="secondary" size="lg" href="#how-it-works" icon={PlayCircle}>
                {t.hero.watchDemo}
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-3">
                {["bg-accent", "bg-ink", "bg-success", "bg-accent-soft"].map((bg, i) => (
                  <span
                    key={i}
                    className={`grid size-10 place-items-center rounded-full border-2 border-white text-[11px] font-bold text-white ${bg}`}
                  >
                    {["MT", "DR", "AK", "+"][i]}
                  </span>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-accent text-accent" />
                  ))}
                  <span className="ml-1 text-small font-bold text-ink">4.9</span>
                </div>
                <p className="text-small text-text-muted">{t.hero.lovedBy}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ---- Phone ---- */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              initial={{ rotateY: 18, rotateX: 6 }}
              animate={{ rotateY: 8, rotateX: 2 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: 1200 }}
            >
              <PhoneMockup screen="map" float priority />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
