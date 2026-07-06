import { camelToKebab } from "../../utils/string";
import type { Theme } from "../theme.types";
import { generateTokensCSS } from "./css-gen-utils";

export function generateComponentSlots(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.slots) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  const slotProp = config.slotProp ?? "section";
  let css = "";

  for (const [slotValue, tokens] of Object.entries(config.slots)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;
    const selector = `[data-slot="${componentName}"][data-${slotProp}="${slotValue}"]`;
    const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme);
    if (body) css += `${selector}{${body}}`;
  }

  return css;
}
