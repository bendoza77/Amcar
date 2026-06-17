/**
 * Seo — declarative, per-route SEO head manager.
 *
 * Relies on React 19's native document-metadata hoisting: <title>, <meta> and
 * <link> elements rendered anywhere in the tree are automatically deduped and
 * lifted into <head>. JSON-LD is emitted as an inline application/ld+json
 * script (Google parses structured data from anywhere in the rendered DOM).
 *
 * This component renders nothing visible — it is pure SEO output.
 *
 * @param {string}   title        full <title> (already includes the brand)
 * @param {string}   description  meta description (~150–160 chars)
 * @param {string[]} [keywords]   optional, non-spammy keyword list
 * @param {string}   path         pathname for canonical/OG URL (e.g. "/contact")
 * @param {string}   lang         active UI language ("ka" | "en")
 * @param {boolean}  [noindex]    emit noindex,follow (e.g. 404)
 * @param {string}   [image]      social share image path (absolute path or URL)
 * @param {"website"|"article"} [ogType]
 * @param {object[]} [jsonLd]     schema.org nodes; combined into one @graph
 */
import {
  SITE_URL,
  BRAND,
  OG_LOCALES,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from "./siteMeta.js";
import { graph } from "./structuredData.js";

export default function Seo({
  title,
  description,
  keywords,
  path = "/",
  lang = "ka",
  noindex = false,
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
  jsonLd = [],
}) {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const primaryLocale = OG_LOCALES[lang] || OG_LOCALES.ka;
  const altLocale = lang === "ka" ? OG_LOCALES.en : OG_LOCALES.ka;

  const structuredData = jsonLd.length ? graph(jsonLd) : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords?.length ? <meta name="keywords" content={keywords.join(", ")} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={BRAND} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={primaryLocale} />
      <meta property="og:locale:alternate" content={altLocale} />

      {/* Twitter / X card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {structuredData ? (
        <script
          type="application/ld+json"
          // Structured data is trusted, app-generated JSON — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}
    </>
  );
}
