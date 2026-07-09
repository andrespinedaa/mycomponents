import { camelToKebab } from "../../utils/string";
import type { Theme } from "../core/theme.types";
import { generateTokensCSS } from "./css-gen-utils";

export function generateComponentPresets(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  const prefix = camelToKebab(componentName);
  const parentPrefix = config.prefixParentName;
  let css = "";

  // Slots: compound child — [data-section="x"][data-preset="y"]
  if (config.slots) {
    for (const [slotName, slotConfig] of Object.entries(config.slots)) {
      if (!slotConfig?.presets) continue;
      for (const [presetName, tokens] of Object.entries(slotConfig.presets)) {
        if (!tokens || Object.keys(tokens).length === 0) continue;
        const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
        if (!body) continue;
        const presetQualifier = presetName === "default" ? "" : `[data-preset="${presetName}"]`;
        css += `[data-slot="${componentName}"][data-section="${slotName}"]${presetQualifier}{${body}}`;
      }
    }
  }

  // Presets: generic style variants — [data-preset="x"]
  if (config.presets) {
    for (const [presetName, tokens] of Object.entries(config.presets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
      if (!body) continue;
      css += `[data-slot="${componentName}"][data-preset="${presetName}"]{${body}}`;
    }
  }

  return css;
}

