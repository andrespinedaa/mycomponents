import { camelToKebab } from "../utils/string";
import type { PartialBreakPointKey, Responsive } from "../theme";

export function isResponsiveObject<T>(value: Responsive<T> | undefined): value is PartialBreakPointKey<T> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cssPropToVarKey(cssProp: string): string {
  return camelToKebab(cssProp);
}
