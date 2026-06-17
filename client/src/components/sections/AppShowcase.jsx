import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import Badge from "../ui/Badge";
import PhoneMockup from "../ui/PhoneMockup";
import { fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";
import { SHOWCASE_SCREENS } from "../../constants/site";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

/**
 * AppShowcase — the headline section. Each app screen gets its own row with
 * an alternating left/right layout and a scroll-reveal. The phone is gently
 * parallaxed against its copy for depth.
 */
export default function AppShowcase() {
  const { t } = useTranslation();
  return (
    <section id="showcase" className="relative bg-surface py-24 lg:py-32">
      <Container>
        <SectionTitle
          eyebrow={t.showcase.eyebrow}
          title={t.showcase.title}
          subtitle={t.showcase.subtitle}
        />

        <div className="mt-20 flex flex-col gap-24 lg:gap-32">
          {t.showcase.items.map((item, i) => (
            <ShowcaseRow
              key={SHOWCASE_SCREENS[i]}
              item={item}
              screen={SHOWCASE_SCREENS[i]}
              reversed={i % 2 === 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ShowcaseRow({ item, screen, reversed }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Copy */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className={cn("max-w-md", reversed && "lg:order-2 lg:ml-auto")}
      >
        <motion.div variants={fadeUp}>
          <Badge tone="neutral">{item.eyebrow}</Badge>
        </motion.div>
        <motion.h3 variants={fadeUp} className="mt-5 text-[2rem] font-extrabold leading-tight tracking-tight text-ink">
          {item.title}
        </motion.h3>
        <motion.p variants={fadeUp} className="mt-4 text-body-lg text-text-muted">
          {item.description}
        </motion.p>
        <motion.ul variants={fadeUp} className="mt-6 flex flex-col gap-3">
          {item.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-[0.975rem] font-medium text-ink">
              <span className="grid size-6 place-items-center rounded-full bg-success/15 text-success">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn("relative flex justify-center", reversed && "lg:order-1")}
      >
        {/* glow plate behind device */}
        <div className="absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />
        <PhoneMockup screen={screen} />
      </motion.div>
    </div>
  );
}
