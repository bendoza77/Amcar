import { useContext } from "react";
import { LanguageContext } from "../context/language-context";

/**
 * useTranslation — access the active language dictionary and controls.
 *
 * @returns {{ t: object, lang: "ka"|"en", setLang: Function, toggle: Function }}
 *   `t` is the full dictionary for the active locale (e.g. t.hero.title).
 */
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a <LanguageProvider>");
  }
  return ctx;
}
