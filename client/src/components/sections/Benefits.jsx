import { motion } from "framer-motion";
import Container from "../layout/Container";
import Badge from "../ui/Badge";
import { useCountUp } from "../../hooks/useCountUp";
import { useTranslation } from "../../hooks/useTranslation";
import { STAT_VALUES, BENEFIT_ICONS } from "../../constants/site";
import { fadeUp, fadeRight, staggerContainer, viewportOnce } from "../../lib/motion";

/**
 * Benefits — dark storytelling band with animated statistics on the left and
 * benefit highlights on the right. The numbers count up when scrolled into view.
 */
export default function Benefits() {
  const { t } = useTranslation();
  return (
    <section id="benefits" className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute -left-24 top-10 size-96 rounded-full bg-accent/25 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left: copy + stats */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.div variants={fadeUp}>
              <Badge tone="accent">{t.benefits.eyebrow}</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="mt-6 text-display font-extrabold text-balance">
              {t.benefits.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 max-w-md text-body-lg text-white/65">
              {t.benefits.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
              {STAT_VALUES.map((stat, i) => (
                <Stat key={i} {...stat} label={t.benefits.statLabels[i]} />
              ))}
            </motion.div>
          </motion.div>

          {/* Right: benefit highlights */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col gap-4"
          >
            {t.benefits.items.map((item, i) => {
              const Icon = BENEFIT_ICONS[i];
              return (
                <motion.div
                  key={i}
                  variants={fadeRight}
                  className="flex gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-accent/40 hover:bg-white/[0.07]"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white">
                    <Icon className="size-6" strokeWidth={2.1} />
                  </div>
                  <div>
                    <h3 className="text-card font-bold">{item.title}</h3>
                    <p className="mt-1.5 text-[0.975rem] leading-relaxed text-white/60">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, suffix, label, decimals = 0 }) {
  const { ref, value: animated } = useCountUp(value);
  // Integers count up and display compactly (12K); decimals (e.g. 4.9 rating)
  // show their exact target since rounding mid-animation would look wrong.
  const shown = decimals > 0 ? Number(value).toFixed(decimals) : formatNumber(animated);

  return (
    <div ref={ref}>
      <div className="text-[2.75rem] font-extrabold leading-none tracking-tight text-white">
        {shown}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="mt-2 text-[0.95rem] text-white/55">{label}</p>
    </div>
  );
}

/** 12000 -> "12K", 120000 -> "120K" for compact display. */
function formatNumber(n) {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(0)}K`;
  }
  return String(n);
}
