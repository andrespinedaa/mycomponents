import type { Theme } from "../core/theme.types";
import { buildSlotSelector, generateTokensCSS, resolveGeneratorNames } from "./css-gen-utils";

export function generateComponentPresets(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.presets) return "";
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const base = buildSlotSelector(resolvedName, config.parentName);
  let css = "";

  for (const [presetName, tokens] of Object.entries(config.presets)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;
    const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
    if (!body) continue;

    // Slot components (con parentName) usan data-section; los demás usan data-preset
    const qualifier = config.parentName
      ? `[data-section="${presetName}"]`
      : `[data-preset="${presetName}"]`;

    css += `${base}${qualifier}{${body}}`;
  }

  return css;
}
