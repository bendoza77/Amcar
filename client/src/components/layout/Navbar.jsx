import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Play } from "lucide-react";
import Container from "./Container";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import LanguageToggle from "../ui/LanguageToggle";
import ThemeToggle from "../ui/ThemeToggle";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useTranslation } from "../../hooks/useTranslation";
import { NAV_LINKS } from "../../constants/site";
import { cn } from "../../lib/utils";

/**
 * Navbar — transparent at the top of the page, transitions to a frosted
 * glassmorphism bar once the user scrolls. Includes the language switch and
 * an animated mobile menu. This is an informational site, so the only CTA
 * is "Get App" — no sign-in / account flows.
 */
export default function Navbar() {
  const { scrolled } = useScrollPosition(24);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={false}
        animate={{
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "transition-colors duration-300",
          scrolled ? "glass border-b border-line/70 shadow-soft" : "border-b border-transparent"
        )}
      >
        <Container className="flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={`/${link.href}`}
                className="rounded-full px-4 py-2 text-[0.95rem] font-medium text-text-muted transition-colors hover:bg-ink/5 hover:text-fg"
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="primary" size="sm" to="/#download" icon={Play}>
              {t.nav.getApp}
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <LanguageToggle />
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-xl text-fg transition-colors hover:bg-ink/5"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </Container>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass border-b border-line lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={`/${link.href}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-fg transition-colors hover:bg-ink/5"
                >
                  {t.nav[link.key]}
                </Link>
              ))}
              <Button
                variant="primary"
                size="md"
                to="/#download"
                icon={Play}
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                {t.nav.getAppFull}
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
