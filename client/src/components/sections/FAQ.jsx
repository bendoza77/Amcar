import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Container from "../layout/Container";
import SectionTitle from "../ui/SectionTitle";
import { useTranslation } from "../../hooks/useTranslation";
import { fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";
import { cn } from "../../lib/utils";

/**
 * FAQ — accessible accordion. One item open at a time; the answer height
 * animates smoothly and the toggle icon rotates into a minus.
 */
export default function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <Container size="narrow">
        <SectionTitle eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 flex flex-col gap-3"
        >
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card transition-colors",
                  isOpen ? "border-accent/40 shadow-soft" : "border-line"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[1.05rem] font-bold text-fg">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
                      isOpen ? "bg-accent text-white" : "bg-ink/5 text-fg"
                    )}
                  >
                    <Plus className="size-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-6 pb-6 text-[1rem] leading-relaxed text-text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
