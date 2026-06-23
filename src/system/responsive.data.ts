import type { PartialBreakPointKey, Responsive } from "../theme/generators/system-css.types";

export function isResponsiveObject<T>(
  value: Responsive<T> | undefined,
): value is PartialBreakPointKey<T> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// camelCase → kebab-case (coincide con camelToKebab de generateVariants)
export function cssPropToVarKey(cssProp: string): string {
  return cssProp.replace(/([A-Z])/g, "-$1").toLowerCase();
}
