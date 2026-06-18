import { createContext } from "react";

/**
 * Bare context object (no component) so the provider and the consumer hook
 * can live in separate files and not trip React Fast Refresh's
 * "only export components" rule.
 *
 * Shape: { theme: "light"|"dark", setTheme, toggle, isDark }
 */
export const ThemeContext = createContext(null);
