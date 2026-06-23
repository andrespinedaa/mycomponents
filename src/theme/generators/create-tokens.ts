import { STYLE_PROPS_DATA } from "./system-css.data";
import { camelToKebab } from "./generateVariants";

export type ComponentTokenMap = Record<string, `--${string}`>;

export function generateComponentBaseCSS(
  slotName: string,
  tokens: ComponentTokenMap,
  defaults: Partial<Record<string, string>> = {},
): string {
  let css = `[data-slot="${slotName}"]{`;
  for (const [key, varName] of Object.entries(tokens)) {
    const def = STYLE_PROPS_DATA[key];
    const cssProp = def?.properties[0] ?? key;
    const fallback = defaults[key] ?? "unset";
    css += `${camelToKebab(cssProp)}:var(${varName},${fallback});`;
  }
  css += "}";
  return css;
}
