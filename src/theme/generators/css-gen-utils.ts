import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_DATA } from "./system-css.data";
import type { Theme } from "../core/theme.types";
import { resolveTokenValue } from "./generateVariants";

export function resolveVarName(key: string, prefix: string): string {
  const def = STYLE_PROPS_DATA[key];
  return def
    ? `--${prefix}-${camelToKebab(def.properties[0])}`
    : `--${prefix}-${camelToKebab(key)}`;
}

export function getCssProp(key: string): string {
  return STYLE_PROPS_DATA[key]?.properties[0] ?? camelToKebab(key);
}

export function generateTokensCSS(
  tokens: Record<string, unknown>,
  prefix: string,
  theme: Theme,
): string {
  let css = "";
  for (const [key, value] of Object.entries(tokens)) {
    if (value == null) continue;
    css += `${resolveVarName(key, prefix)}:${resolveTokenValue(key, String(value), theme)};`;
  }
  return css;
}
