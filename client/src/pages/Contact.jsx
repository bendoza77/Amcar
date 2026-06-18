import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, LifeBuoy, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { useTranslation } from "../hooks/useTranslation";
import { fadeUp, staggerContainer } from "../lib/motion";
import Seo from "../seo/Seo";
import { getRoute } from "../seo/siteMeta";
import { webPageSchema, breadcrumbSchema } from "../seo/structuredData";

const METHOD_ICONS = [Phone, LifeBuoy, MapPin, Clock];

/**
 * Contact — a designed contact page: intro, four contact-method cards, and a
 * message form with a friendly success state. Pure front-end; the form just
 * confirms receipt (no backend wired up yet).
 */
export default function Contact() {
  const { t, lang } = useTranslation();
  const c = t.pages.contact;
  const f = c.fields;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const m = getRoute("/contact").meta[lang];
  const crumbs = [
    { name: t.brand, path: "/" },
    { name: c.title, path: "/contact" },
  ];
  const jsonLd = [
    breadcrumbSchema(crumbs, "/contact"),
    webPageSchema({
      path: "/contact",
      name: m.title,
      description: m.description,
      inLanguage: lang,
      breadcrumb: true,
    }),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSending(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="pb-24 pt-32 lg:pb-32 lg:pt-40">
      <Seo
        title={m.title}
        description={m.description}
        keywords={m.keywords}
        path="/contact"
        lang={lang}
        jsonLd={jsonLd}
      />
      <Container>
        {/* Header */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={fadeUp}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-small font-semibold text-text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-4" /> {t.pages.backHome}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6">
            <Badge tone="accent">{c.eyebrow}</Badge>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-display font-extrabold tracking-tight text-fg text-balance"
          >
            {c.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-body-lg text-text-muted text-pretty">
            {c.subtitle}
          </motion.p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          {/* Contact methods */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid auto-rows-fr gap-4 self-start sm:grid-cols-2 lg:grid-cols-1"
          >
            {c.methods.map((m, i) => {
              const Icon = METHOD_ICONS[i];
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex h-full items-start gap-4 rounded-2xl border border-line bg-card p-5 transition-shadow hover:shadow-soft"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-small font-bold uppercase tracking-wider text-text-muted">
                      {m.title}
                    </p>
                    <p className="mt-1 break-words text-[1.05rem] font-bold tracking-tight text-fg">
                      {m.value}
                    </p>
                    {m.desc && <p className="mt-0.5 text-[0.9rem] text-text-muted">{m.desc}</p>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
          >
            {sent ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-success/15 text-success">
                  <CheckCircle2 className="size-7" />
                </span>
                <p className="mt-5 max-w-sm text-body-lg font-medium text-fg text-pretty">
                  {c.success}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-card font-extrabold tracking-tight text-fg">{c.formTitle}</h2>
                <p className="mt-1.5 text-[0.95rem] text-text-muted">{c.formSubtitle}</p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={f.name} placeholder={f.namePh} name="name" required />
                    <Field
                      label={f.email}
                      placeholder={f.emailPh}
                      name="email"
                      type="email"
                      required
                    />
                  </div>
                  <Field label={f.subject} placeholder={f.subjectPh} name="subject" />
                  <Field
                    label={f.message}
                    placeholder={f.messagePh}
                    name="message"
                    as="textarea"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Send}
                    className="mt-2 w-full"
                    disabled={sending}
                  >
                    {sending ? c.sending : c.send}
                  </Button>
                  {error && (
                    <p className="text-center text-[0.9rem] font-medium text-red-600">{c.error}</p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** Labeled input/textarea matched to the site's form styling. */
function Field({ label, placeholder, name, type = "text", as = "input", required }) {
  const base =
    "w-full rounded-xl border border-line bg-card px-4 py-3 text-[0.95rem] text-fg placeholder:text-text-muted/70 outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/10";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-small font-semibold text-fg">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} placeholder={placeholder} required={required} rows={5} className={base} />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={base}
        />
      )}
    </label>
  );
}
