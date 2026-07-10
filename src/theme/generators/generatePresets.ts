import type { Theme } from "../core/theme.types";
import { buildSlotSelector, generateTokensCSS, resolveGeneratorNames } from "./css-gen-utils";

export function generateComponentPresets(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const base = buildSlotSelector(resolvedName, config.parentName);
  let css = "";

  // ── flat presets: [data-preset="X"] ─────────────────────────────────────────
  if (config.presets) {
    for (const [presetName, tokens] of Object.entries(config.presets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
      if (!body) continue;
      css += `${base}[data-preset="${presetName}"]{${body}}`;
    }
  }

  // ── sections: [data-section="X"] + [data-section="X"][data-preset="Y"] ──────
  if (config.sections) {
    for (const [sectionName, sectionEntry] of Object.entries(config.sections)) {
      if (!sectionEntry) continue;
      const { presets: sectionPresets, ...sectionTokens } = sectionEntry as Record<string, unknown> & { presets?: Record<string, unknown> };
      const sectionSelector = `${base}[data-section="${sectionName}"]`;

      if (Object.keys(sectionTokens).length > 0) {
        const body = generateTokensCSS(sectionTokens, prefix, theme, parentPrefix);
        if (body) css += `${sectionSelector}{${body}}`;
      }

      if (sectionPresets) {
        for (const [presetName, presetTokens] of Object.entries(sectionPresets)) {
          if (!presetTokens || Object.keys(presetTokens).length === 0) continue;
          const body = generateTokensCSS(presetTokens as Record<string, unknown>, prefix, theme, parentPrefix);
          if (body) css += `${sectionSelector}[data-preset="${presetName}"]{${body}}`;
        }
      }
    }
  }

  return css;
}
