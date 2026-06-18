import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context";

export const THEME_STORAGE_KEY = "amcar-theme";

/**
 * Read the initial theme: an explicit saved choice wins, otherwise fall back
 * to the OS preference. Mirrors the inline boot script in index.html, which
 * applies the `.dark` class before paint to avoid a flash.
 */
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * ThemeProvider — owns light/dark, persists the choice, toggles the `.dark`
 * class on <html>, and keeps the browser theme-color meta in sync. Wrap the
 * app once at the root.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Match the mobile browser chrome to the page background.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0c0f" : "#ffffff");
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggle, isDark: theme === "dark" }),
    [theme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
