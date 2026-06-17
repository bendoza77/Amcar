import { motion } from "framer-motion";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import { useTranslation } from "../hooks/useTranslation";
import { fadeUp, staggerContainer } from "../lib/motion";
import Seo from "../seo/Seo";
import { getRoute } from "../seo/siteMeta";
import {
  webPageSchema,
  breadcrumbSchema,
  articleSchema,
} from "../seo/structuredData";

/** Slug a heading so it can anchor the in-page table of contents. */
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");

/* Map each legal doc's localized "updated" label to an ISO date for schema. */
const UPDATED_ISO = "2026-06-01";

/**
 * LegalPage — one templated document layout shared by Privacy, Terms, Cookies,
 * and Licenses. Content comes from t.pages.legal[docKey]. A sticky table of
 * contents sits beside the prose on large screens.
 *
 * @param {"privacy"|"terms"|"cookies"|"licenses"} docKey
 */
export default function LegalPage({ docKey }) {
  const { t, lang } = useTranslation();
  const doc = t.pages.legal[docKey];

  const path = `/${docKey}`;
  const m = getRoute(path).meta[lang];
  const crumbs = [
    { name: t.brand, path: "/" },
    { name: doc.title, path },
  ];
  const jsonLd = [
    breadcrumbSchema(crumbs, path),
    webPageSchema({
      path,
      name: m.title,
      description: m.description,
      inLanguage: lang,
      breadcrumb: true,
    }),
    articleSchema({
      path,
      headline: doc.title,
      description: m.description,
      datePublished: UPDATED_ISO,
      dateModified: UPDATED_ISO,
      inLanguage: lang,
    }),
  ];

  return (
    <article className="pb-24 pt-32 lg:pb-32 lg:pt-40">
      <Seo
        title={m.title}
        description={m.description}
        path={path}
        lang={lang}
        ogType="article"
        jsonLd={jsonLd}
      />
      {/* Header */}
      <Container>
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={fadeUp}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-small font-semibold text-text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-4" /> {t.pages.backHome}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6">
            <Badge tone="neutral">{doc.eyebrow}</Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-display font-extrabold tracking-tight text-ink text-balance"
          >
            {doc.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 text-body-lg text-text-muted text-pretty">
            {doc.intro}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 inline-flex items-center gap-2 text-small font-medium text-text-muted"
          >
            <CalendarClock className="size-4 text-accent" />
            {t.pages.updatedLabel}: {doc.updated}
          </motion.p>
        </motion.div>
      </Container>

      {/* Body */}
      <Container className="mt-14 lg:mt-16">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-small font-bold uppercase tracking-wider text-text-muted">
                {t.pages.tocTitle}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 border-l border-line">
                {doc.sections.map((s) => (
                  <li key={s.heading}>
                    <a
                      href={`#${slug(s.heading)}`}
                      className="-ml-px block border-l-2 border-transparent pl-4 text-[0.9rem] text-text-muted transition-colors hover:border-accent hover:text-ink"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sections */}
          <div className="max-w-2xl">
            {doc.sections.map((s, i) => (
              <motion.section
                key={s.heading}
                id={slug(s.heading)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="scroll-mt-28 border-line py-8 first:pt-0 [&:not(:last-child)]:border-b"
              >
                <h2 className="flex items-baseline gap-3 text-card font-extrabold tracking-tight text-ink">
                  <span className="text-[0.95rem] font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.heading}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {s.body.map((p, j) => (
                    <p key={j} className="text-[1rem] leading-relaxed text-text-muted text-pretty">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </Container>
    </article>
  );
}
