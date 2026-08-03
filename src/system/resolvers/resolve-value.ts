import { camelToKebab, dotToKebab } from "../../utils/string";
import type { CategoryTokens } from "../../theme/core/theme.types";

const SIZE_ALIASES: Record<string, string> = {
  full: "100%",
  screen: "100vw",
  fit: "fit-content",
  auto: "auto",
};

export function resolveValue(
  value: string | number,
  category: CategoryTokens,
  tokenVars: Record<string, string>,
): string {
  const v = String(value);

  if (category === "raw") return v;
  if (category === "spacing" && v in SIZE_ALIASES) return SIZE_ALIASES[v];

  const prefix = camelToKebab(category);
  const key = category === "colors" ? `${prefix}-${dotToKebab(v)}` : `${prefix}-${v}`;

  return tokenVars[key] ?? v;
}
