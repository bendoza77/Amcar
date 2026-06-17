/**
 * structuredData.js — JSON-LD (schema.org) generators.
 *
 * Each function returns a plain object that <Seo> serialises into a
 * <script type="application/ld+json"> tag. Keep these pure and side-effect
 * free so they can also run in the sitemap/SSR-prerender scripts.
 *
 * Reference: https://developers.google.com/search/docs/appearance/structured-data
 */

import {
  SITE_URL,
  BRAND,
  ORG,
  SOCIAL_PROFILES,
  PLAY_STORE_URL,
  APP_STORE_URL,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from "./siteMeta.js";

const abs = (path) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

/* Stable @id anchors let separate nodes reference one another (Google's
   recommended graph pattern) instead of duplicating the organization. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Organization — who publishes the site. Emitted site-wide. */
export function organizationSchema() {
  const node = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: abs(DEFAULT_OG_IMAGE),
    },
    email: ORG.email,
    foundingDate: ORG.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.city,
      addressCountry: ORG.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: ORG.supportEmail,
        telephone: ORG.phone,
        areaServed: "GE",
        availableLanguage: ["ka", "en"],
      },
    ],
  };
  if (SOCIAL_PROFILES.length) node.sameAs = SOCIAL_PROFILES;
  return node;
}

/** WebSite — enables sitelinks search box eligibility + names the publisher. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: BRAND,
    inLanguage: ["ka", "en"],
    publisher: { "@id": ORG_ID },
  };
}

/**
 * MobileApplication — the product itself (Android app).
 *
 * NOTE on ratings: an AggregateRating is only emitted when you pass a real
 * `ratingCount` backed by genuine reviews. Inventing a rating to win stars in
 * search results violates Google's policy and can trigger a manual action, so
 * it is intentionally opt-in and off by default until live store data exists.
 */
export function appSchema({ ratingValue, ratingCount } = {}) {
  const node = {
    "@type": "MobileApplication",
    "@id": `${SITE_URL}/#app`,
    name: BRAND,
    operatingSystem: "ANDROID",
    applicationCategory: "TravelApplication",
    description:
      "Find nearby trusted car mechanics, compare services and prices, and navigate to them — in one app.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  };
  if (ratingCount) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      ratingCount: String(ratingCount),
      bestRating: "5",
      worstRating: "1",
    };
  }
  const downloadUrl = PLAY_STORE_URL || APP_STORE_URL;
  if (downloadUrl) node.downloadUrl = downloadUrl;
  return node;
}

/**
 * WebPage — generic page node tied into the website graph. `breadcrumb` may be
 * the @id of a BreadcrumbList emitted alongside it.
 */
export function webPageSchema({ path, name, description, inLanguage, breadcrumb = false }) {
  const node = {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}/#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
  };
  if (breadcrumb) node.breadcrumb = { "@id": `${absoluteUrl(path)}/#breadcrumb` };
  return node;
}

/**
 * BreadcrumbList — trail from Home to the current page. Pass an ordered array
 * of { name, path } crumbs (Home first, current page last).
 */
export function breadcrumbSchema(crumbs, path) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}/#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/**
 * FAQPage — built from the localized FAQ items already shown on the page, so
 * the markup never diverges from visible content (a Google requirement).
 */
export function faqSchema(items = []) {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Article — for the legal/policy documents. They are technical articles with a
 * clear publisher and revision date, which schema.org models well.
 */
export function articleSchema({ path, headline, description, datePublished, dateModified, inLanguage }) {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(path)}/#article`,
    headline,
    description,
    inLanguage,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: { "@id": `${absoluteUrl(path)}/#webpage` },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Wrap one or more schema nodes into a single @graph document. Using one graph
 * per page (instead of many disconnected scripts) is Google's preferred shape
 * and lets nodes cross-reference by @id.
 */
export function graph(nodes) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
