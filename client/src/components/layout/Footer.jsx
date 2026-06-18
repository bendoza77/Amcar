import { Link } from "react-router-dom";
import Container from "./Container";
import Logo from "../ui/Logo";
import StoreButtons from "../ui/StoreButtons";
import { FOOTER_HREFS } from "../../constants/site";
import { useTranslation } from "../../hooks/useTranslation";

/* Inline brand glyphs — lucide dropped brand icons, and crisp SVGs look better. */
const BRAND_PATHS = {
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608C4.519 2.567 5.786 2.293 7.152 2.231 8.418 2.175 8.796 2.163 12 2.163zm0 1.802c-3.15 0-3.522.012-4.766.069-1.15.052-1.775.244-2.19.405-.55.214-.943.47-1.356.883-.413.413-.669.806-.883 1.356-.161.415-.353 1.04-.405 2.19-.057 1.244-.069 1.616-.069 4.766s.012 3.522.069 4.766c.052 1.15.244 1.775.405 2.19.214.55.47.943.883 1.356.413.413.806.669 1.356.883.415.161 1.04.353 2.19.405 1.244.057 1.616.069 4.766.069s3.522-.012 4.766-.069c1.15-.052 1.775-.244 2.19-.405.55-.214.943-.47 1.356-.883.413-.413.669-.806.883-1.356.161-.415.353-1.04.405-2.19.057-1.244.069-1.616.069-4.766s-.012-3.522-.069-4.766c-.052-1.15-.244-1.775-.405-2.19-.214-.55-.47-.943-.883-1.356-.413-.413-.806-.669-1.356-.883-.415-.161-1.04-.353-2.19-.405-1.244-.057-1.616-.069-4.766-.069zm0 3.063A5.135 5.135 0 1017.135 12 5.135 5.135 0 0012 7.028zm0 8.468A3.333 3.333 0 1115.333 12 3.333 3.333 0 0112 15.496zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z",
};

const SOCIALS = [
  { key: "x", label: "X", href: "#" },
  { key: "instagram", label: "Instagram", href: "#" },
  { key: "linkedin", label: "LinkedIn", href: "#" },
  { key: "github", label: "GitHub", href: "#" },
];

function BrandIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

/* Internal route ("/contact", "/#features") → SPA Link; bare "#" → plain anchor. */
function FooterLink({ href, children }) {
  const className = "text-[0.95rem] text-white/70 transition-colors hover:text-white";
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function FooterColumn({ title, labels, hrefs }) {
  return (
    <div>
      <h4 className="text-small font-bold uppercase tracking-wider text-white/50">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3">
        {labels.map((label, i) => (
          <li key={label}>
            <FooterLink href={hrefs[i]}>{label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Footer — dark, multi-column footer with brand, link groups, store badges,
 * and social links. Closes the page on a confident, premium note.
 */
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <Container className="relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-4 text-[0.95rem] leading-relaxed text-white/60">
              {t.footer.brandDesc}
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ key, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <BrandIcon name={key} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={t.footer.productTitle} labels={t.footer.product} hrefs={FOOTER_HREFS.product} />
          <FooterColumn title={t.footer.companyTitle} labels={t.footer.company} hrefs={FOOTER_HREFS.company} />
          <FooterColumn title={t.footer.legalTitle} labels={t.footer.legal} hrefs={FOOTER_HREFS.legal} />
        </div>

        {/* App badges */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 lg:flex-row lg:items-center">
          <div>
            <p className="text-cardtitle font-bold tracking-tight">{t.footer.getOnPhone}</p>
            <p className="mt-1 text-[0.95rem] text-white/60">{t.footer.getOnPhoneSub}</p>
          </div>
          <StoreButtons tone="light" />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-small text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {t.brand}. {t.footer.rights}</p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-success" />
            {t.footer.operational}
          </p>
        </div>
      </Container>
    </footer>
  );
}
