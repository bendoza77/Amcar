/**
 * site.js — structural, language-independent data only.
 * All user-facing copy lives in src/i18n/dictionary.js and is zipped with
 * these arrays by index inside the components.
 */

import {
  MapPin,
  Wrench,
  Tags,
  Navigation,
  ShieldCheck,
  Clock,
  Search,
  GitCompareArrows,
  Route,
} from "lucide-react";

export const SITE = {
  name: "Amcar",
  appStoreUrl: "#app-store",
  playStoreUrl: "#play-store",
};

/* Nav: `key` maps into t.nav, `href` is the link target (rendered as `/${href}`).
   The marketing sections now live under /home, so their anchors are prefixed.
   `map` points at the root map — the site's primary function. */
export const NAV_LINKS = [
  { key: "features", href: "home#features" },
  { key: "how", href: "home#how-it-works" },
  { key: "about", href: "home#benefits" },
  { key: "map", href: "map" },
];

/* Icons in display order — paired with t.features.items by index. */
export const FEATURE_ICONS = [MapPin, Wrench, Tags, GitCompareArrows, Navigation, ShieldCheck];

/* Which PhoneMockup screen each showcase row renders. */
export const SHOWCASE_SCREENS = ["home", "map", "service", "profile"];

/* How-it-works icons + step numbers — paired with t.steps.items. */
export const STEP_ICONS = [Search, GitCompareArrows, Route];
export const STEP_NUMBERS = ["01", "02", "03"];

/* Benefit icons — paired with t.benefits.items. */
export const BENEFIT_ICONS = [Clock, ShieldCheck, Tags];

/* Footer link targets — paired with t.footer.{product,company,legal} labels.
   In-page sections use "/#id" so they also work from sub-pages; standalone
   pages use their route path. */
export const FOOTER_HREFS = {
  product: ["/home#features", "/home#how-it-works", "/home#download"],
  company: ["/home#benefits", "#", "#", "/contact"],
  legal: ["/privacy", "/terms", "/cookies", "/licenses"],
};
