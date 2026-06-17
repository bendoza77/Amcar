import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

const RATING = 5;

/**
 * Testimonials — a glass-card carousel. One featured quote rotates with
 * prev/next controls and dots; surrounding cards are shown as a soft stack
 * on larger screens for depth.
 */
export default function Testimonials() {
  const { t } = useTranslation();
  const items = t.testimonials.items;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next) => {
    setDir(next > index || (index === items.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + items.length) % items.length);
  };

  const active = items[index];

  return (
    <section id="testimonials" className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-spotlight opacity-60" />

      <Container className="relative">
        <SectionTitle
          eyebrow={t.testimonials.eyebrow}
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card glass className="px-8 py-10 sm:px-12 sm:py-14">
                <Quote className="size-10 text-accent/30" />
                <p className="mt-5 text-[1.4rem] font-semibold leading-snug tracking-tight text-ink sm:text-[1.6rem]">
                  “{active.quote}”
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-ink text-[0.95rem] font-bold text-white">
                    {active.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-ink">{active.name}</p>
                    <p className="text-small text-text-muted">{active.role}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(RATING)].map((_, i) => (
                      <Star key={i} className="size-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <CarouselButton onClick={() => go(index - 1)} label="Previous">
              <ChevronLeft className="size-5" />
            </CarouselButton>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-accent" : "w-2 bg-ink/15 hover:bg-ink/30"
                  )}
                />
              ))}
            </div>

            <CarouselButton onClick={() => go(index + 1)} label="Next">
              <ChevronRight className="size-5" />
            </CarouselButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CarouselButton({ onClick, label, children }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink shadow-soft transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </motion.button>
  );
}
