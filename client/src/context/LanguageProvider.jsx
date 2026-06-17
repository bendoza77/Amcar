import { useCallback, useEffect, useMemo, useState } from "react";
import { LanguageContext } from "./language-context";
import { dictionaries, DEFAULT_LANG } from "../i18n/dictionary";

const STORAGE_KEY = "sando-lang";

/** Read the saved language, falling back to Georgian (the primary language). */
function getInitialLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && dictionaries[saved] ? saved : DEFAULT_LANG;
}

/**
 * LanguageProvider — owns the active language, persists it, keeps the
 * document <html lang> attribute in sync, and exposes the active dictionary
 * (`t`) plus a toggle. Wrap the app once at the root.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "ka" ? "en" : "ka"));
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t: dictionaries[lang] }),
    [lang, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
