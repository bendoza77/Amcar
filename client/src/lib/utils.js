/**
 * cn — tiny classname joiner (no external deps).
 * Filters out falsy values so conditional classes stay readable:
 *   cn("base", isActive && "active", disabled && "opacity-50")
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
