import { camelToKebab } from "../../utils/string";
import type { Theme } from "../core/theme.types";
import { generateTokensCSS } from "./css-gen-utils";

function prefixToPascal(prefix: string): string {
  return prefix.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

function deriveSlotProp(componentName: string, prefixParent: string): string {
  const parentName = prefixToPascal(prefixParent);
  if (componentName.startsWith(parentName)) {
    return componentName.slice(parentName.length).toLowerCase();
  }
  return "slot";
}

export function generateComponentSlots(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.slots) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  const slotProp = config.prefixParent
    ? deriveSlotProp(componentName, config.prefixParent)
    : "section";

  let css = "";
  for (const [slotValue, tokens] of Object.entries(config.slots)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;
    const selector = `[data-slot="${componentName}"][data-${slotProp}="${slotValue}"]`;
    const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, config.prefixParent);
    if (body) css += `${selector}{${body}}`;
  }

  return css;
}
