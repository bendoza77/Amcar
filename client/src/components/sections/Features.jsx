import { motion } from "framer-motion";
import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import { FEATURE_ICONS } from "../../constants/site";
import { useTranslation } from "../../hooks/useTranslation";
import { fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

/**
 * Features — six premium feature cards in a responsive grid.
 * Cards lift, deepen their shadow, and reveal an accent border on hover.
 * Icons come from constants; copy comes from the active locale.
 */
export default function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-24 lg:py-32">
      <Container>
        <SectionTitle
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {t.features.items.map((item, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <motion.div key={item.title} variants={fadeUp}>
                <Card interactive className="h-full">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-6" strokeWidth={2.1} />
                  </div>
                  <h3 className="mt-5 text-card font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[0.975rem] leading-relaxed text-text-muted">{item.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
