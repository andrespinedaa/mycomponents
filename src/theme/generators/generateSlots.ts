import { camelToKebab } from "../../utils/string";
import type { Theme } from "../theme.types";
import { resolveVarName } from "./css-gen-utils";
import { resolveTokenValue } from "./generateVariants";

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
    css += `${selector}{`;
    for (const [key, value] of Object.entries(tokens)) {
      if (value == null) continue;
      css += `${resolveVarName(key, prefix)}:${resolveTokenValue(key, String(value), theme)};`;
    }
    css += "}";
  }

  return css;
}
