import { Home } from "lucide-react";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import { useTranslation } from "../hooks/useTranslation";
import Seo from "../seo/Seo";

/**
 * NotFound — friendly 404 for any unmatched route.
 *
 * SEO: explicitly noindex (but still follow) so soft-404s never get indexed,
 * while link equity from any stray inbound link can still flow through.
 */
export default function NotFound() {
  const { t, lang } = useTranslation();
  const n = t.pages.notFound;

  return (
    <section className="grid min-h-[70vh] place-items-center px-5 pt-32 pb-20 text-center">
      <Seo
        title={`${n.title} | ${t.brand}`}
        description={n.subtitle}
        path="/404"
        lang={lang}
        noindex
      />
      <Container size="narrow">
        <p className="text-[5rem] font-extrabold leading-none text-accent">404</p>
        <h1 className="mt-4 text-display font-extrabold tracking-tight text-fg">{n.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-text-muted text-pretty">{n.subtitle}</p>
        <div className="mt-8 flex justify-center">
          <Button to="/" variant="primary" size="lg" icon={Home}>
            {n.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
