import type { CategoryTokens, VarsCss } from "../../theme/theme.types";
import { camelToKebab, dotToKebab } from "../../utils/string";

export const SIZE_ALIASES: Record<string, string> = {
  full: "100%",
  screen: "100vw",
  fit: "fit-content",
  auto: "auto",
};

export function resolveValue(
  value: string | number,
  category: keyof CategoryTokens,
  tokenVars: VarsCss,
): string {
  const v = String(value);

  if (category === "raw") return v;
  if (category === "spacing" && v in SIZE_ALIASES) return SIZE_ALIASES[v];

  if (category === "colors" && !v.includes(".")) {
    return tokenVars[`color-${camelToKebab(v)}`] ?? v;
  }

  const prefix = camelToKebab(category);
  const key = category === "colors" ? `${prefix}-${dotToKebab(v)}` : `${prefix}-${v}`;

  return tokenVars[key] ?? v;
}
