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
  name: "ხოდზე",
  appStoreUrl: "#app-store",
  playStoreUrl: "#play-store",
};

/* Nav: `key` maps into t.nav, `href` is the scroll target. */
export const NAV_LINKS = [
  { key: "features", href: "#features" },
  { key: "how", href: "#how-it-works" },
  { key: "about", href: "#benefits" },
  { key: "reviews", href: "#testimonials" },
];

/* Icons in display order — paired with t.features.items by index. */
export const FEATURE_ICONS = [MapPin, Wrench, Tags, GitCompareArrows, Navigation, ShieldCheck];

/* Which PhoneMockup screen each showcase row renders. */
export const SHOWCASE_SCREENS = ["home", "map", "service", "profile"];

/* How-it-works icons + step numbers — paired with t.steps.items. */
export const STEP_ICONS = [Search, GitCompareArrows, Route];
export const STEP_NUMBERS = ["01", "02", "03"];

/* Numeric stat values (suffix/decimals are presentation, labels come from t). */
export const STAT_VALUES = [
  { value: 10000, suffix: "+" },
  { value: 500, suffix: "+" },
  { value: 120000, suffix: "+" },
  { value: 4.9, suffix: "★", decimals: 1 },
];

/* Benefit icons — paired with t.benefits.items. */
export const BENEFIT_ICONS = [Clock, ShieldCheck, Tags];

/* Footer link targets — paired with t.footer.{product,company,legal} labels. */
export const FOOTER_HREFS = {
  product: ["#features", "#how-it-works", "#testimonials", "#download"],
  company: ["#", "#", "#", "#"],
  legal: ["#", "#", "#", "#"],
};
