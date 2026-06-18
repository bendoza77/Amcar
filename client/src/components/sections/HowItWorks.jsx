import { motion } from "framer-motion";
import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import { STEP_ICONS, STEP_NUMBERS } from "../../constants/site";
import { useTranslation } from "../../hooks/useTranslation";
import { fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

/**
 * HowItWorks — three-step process (Find → Compare → Navigate).
 * Steps sit on an animated connecting path that draws itself into view.
 */
export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <Container>
        <SectionTitle
          eyebrow={t.steps.eyebrow}
          title={t.steps.title}
          subtitle={t.steps.subtitle}
        />

        <div className="relative mt-20">
          {/* Animated connecting line (desktop) */}
          <svg
            className="absolute left-0 top-12 hidden h-2 w-full lg:block"
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <motion.path
              d="M40 4 H960"
              stroke="#FF6B00"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="2 10"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </svg>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-10 lg:grid-cols-3 lg:gap-8"
          >
            {t.steps.items.map((item, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <motion.div key={i} variants={fadeUp} className="relative flex flex-col items-center text-center">
                  {/* Node */}
                  <div className="relative grid size-24 place-items-center rounded-3xl bg-card shadow-lift ring-1 ring-line">
                    <Icon className="size-9 text-accent" strokeWidth={2} />
                    <span className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full bg-ink text-small font-bold text-white">
                      {STEP_NUMBERS[i]}
                    </span>
                  </div>
                  <h3 className="mt-7 text-cardtitle font-bold text-fg">{item.title}</h3>
                  <p className="mt-2 max-w-xs text-[0.975rem] leading-relaxed text-text-muted">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
