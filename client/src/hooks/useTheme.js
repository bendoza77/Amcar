import { useContext } from "react";
import { ThemeContext } from "../context/theme-context";

/**
 * useTheme — access the active color theme and controls.
 *
 * @returns {{ theme: "light"|"dark", setTheme: Function, toggle: Function, isDark: boolean }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
