/**
 * siteMeta.js — single source of truth for all SEO-level metadata.
 *
 * Nothing visual lives here. This module drives:
 *   - <title> / meta description / keywords (per route, per language)
 *   - canonical + hreflang alternates
 *   - Open Graph / Twitter cards
 *   - JSON-LD structured data (organization, website, app, breadcrumbs)
 *   - sitemap.xml generation (scripts/generate-sitemap.mjs reads ROUTES)
 *
 * The site is bilingual (Georgian primary, English alternate) and both
 * languages are served from the SAME URL (client-side toggle), so we do NOT
 * fabricate /en/ paths. Instead each URL is self-canonical and we advertise
 * the available locales via og:locale + og:locale:alternate.
 */

/* Absolute production origin — no trailing slash. Override at build/runtime
   with VITE_SITE_URL (e.g. a staging domain) without touching code. */
export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  "https://www.amcar.ge"
).replace(/\/+$/, "");

export const BRAND = "Amcar";

/* Primary language drives <html lang> on first paint and the canonical copy. */
export const PRIMARY_LOCALE = "ka";
export const OG_LOCALES = { ka: "ka_GE", en: "en_US" };

/* Social profiles — wire real URLs here; they feed Organization.sameAs.
   Empty strings are filtered out so we never emit dead "#" links to crawlers. */
export const SOCIAL_PROFILES = [
  "", // X / Twitter
  "", // Instagram
  "", // LinkedIn
  "", // GitHub
].filter(Boolean);

/* Distribution + contact — used by app/organization structured data. */
export const PLAY_STORE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_PLAY_STORE_URL) ||
  "";
export const APP_STORE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APP_STORE_URL) ||
  "";

export const ORG = {
  email: "hello@amcar.ge",
  supportEmail: "support@amcar.ge",
  phone: "+995 322 00 00 00",
  address: {
    street: "12 Rustaveli Ave",
    city: "Tbilisi",
    country: "GE",
  },
  foundingYear: "2026",
};

/* Default social-share image: a purpose-built 1200×630 raster card (crawlers
   generally don't render SVG og:images). */
export const DEFAULT_OG_IMAGE = "/brand/og-image.png";

/**
 * ROUTES — every indexable URL plus its per-language meta. Keep this list and
 * App.jsx in sync; the sitemap generator and <Seo> both read from here.
 *
 * type        → which JSON-LD that page layers in (handled in the page itself)
 * priority    → sitemap <priority>
 * changefreq  → sitemap <changefreq>
 * indexable   → false ⇒ noindex,follow and excluded from the sitemap
 */
export const ROUTES = [
  {
    path: "/",
    type: "home",
    priority: 1.0,
    changefreq: "weekly",
    indexable: true,
    meta: {
      ka: {
        title: "Amcar — იპოვეთ სანდო ავტოხელოსნები უფრო სწრაფად",
        description:
          "Amcar ეხმარება მძღოლებს იპოვონ ახლომდებარე სანდო ავტოხელოსნები, შეადარონ სერვისები და ფასები რუკაზე და თავდაჯერებულად დაუბრუნდნენ გზას. ჩამოტვირთეთ Android აპლიკაცია უფასოდ.",
        keywords: [
          "ავტოხელოსანი",
          "ავტოსერვისი",
          "ხელოსნის ძებნა",
          "ზეთის შეცვლა",
          "ავტომობილის შეკეთება",
          "Amcar",
        ],
      },
      en: {
        title: "Amcar — Find Trusted Car Mechanics Faster",
        description:
          "Amcar helps drivers find nearby trusted mechanics, compare services and prices on a live map, and get back on the road with confidence. Download the free Android app.",
        keywords: [
          "find a mechanic",
          "car repair app",
          "auto service near me",
          "compare mechanic prices",
          "oil change",
          "Amcar",
        ],
      },
    },
  },
  {
    path: "/contact",
    type: "contact",
    priority: 0.7,
    changefreq: "yearly",
    indexable: true,
    meta: {
      ka: {
        title: "კონტაქტი — დაგვიკავშირდით | Amcar",
        description:
          "დაუკავშირდით Amcar-ის გუნდს. ელფოსტა, ტელეფონი, ოფისი თბილისში და მხარდაჭერა აპლიკაციასთან დაკავშირებით.",
        keywords: ["Amcar კონტაქტი", "მხარდაჭერა", "დაკავშირება"],
      },
      en: {
        title: "Contact Us — Get in Touch | Amcar",
        description:
          "Reach the Amcar team by email, phone, or at our Tbilisi office, and get help with the app from our support team.",
        keywords: ["contact Amcar", "Amcar support", "get in touch"],
      },
    },
  },
  {
    path: "/privacy",
    type: "legal",
    docKey: "privacy",
    priority: 0.3,
    changefreq: "yearly",
    indexable: true,
    meta: {
      ka: {
        title: "კონფიდენციალურობის პოლიტიკა | Amcar",
        description:
          "შეიტყვეთ, რა მონაცემებს აგროვებს Amcar, როგორ ვიყენებთ მათ და რა უფლებები გაქვთ აპლიკაციის გამოყენებისას.",
      },
      en: {
        title: "Privacy Policy | Amcar",
        description:
          "Learn what data Amcar collects, how we use it, and the rights you have when using the app.",
      },
    },
  },
  {
    path: "/terms",
    type: "legal",
    docKey: "terms",
    priority: 0.3,
    changefreq: "yearly",
    indexable: true,
    meta: {
      ka: {
        title: "მომსახურების პირობები | Amcar",
        description:
          "Amcar-ის გამოყენების წესები და პირობები მძღოლებისთვის და ხელოსნებისთვის.",
      },
      en: {
        title: "Terms of Service | Amcar",
        description: "The rules and terms that govern your use of Amcar.",
      },
    },
  },
  {
    path: "/cookies",
    type: "legal",
    docKey: "cookies",
    priority: 0.3,
    changefreq: "yearly",
    indexable: true,
    meta: {
      ka: {
        title: "ქუქი-ფაილების პოლიტიკა | Amcar",
        description:
          "როგორ იყენებს Amcar ქუქი-ფაილებსა და მსგავს ტექნოლოგიებს ვებსაიტსა და აპლიკაციაში.",
      },
      en: {
        title: "Cookie Policy | Amcar",
        description:
          "How Amcar uses cookies and similar technologies across the website and app.",
      },
    },
  },
  {
    path: "/licenses",
    type: "legal",
    docKey: "licenses",
    priority: 0.2,
    changefreq: "yearly",
    indexable: true,
    meta: {
      ka: {
        title: "ლიცენზიები | Amcar",
        description:
          "ღია წყაროს ბიბლიოთეკები და სავაჭრო ნიშნები, რომლებზეც აგებულია Amcar.",
      },
      en: {
        title: "Licenses | Amcar",
        description:
          "The open-source libraries and trademarks that Amcar is built on.",
      },
    },
  },
];

/** Look up a route definition by its pathname. */
export function getRoute(pathname) {
  return ROUTES.find((r) => r.path === pathname);
}

/** Build an absolute, lowercase, no-trailing-slash URL from a pathname. */
export function absoluteUrl(pathname = "/") {
  const clean = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `${SITE_URL}${clean}`;
}
