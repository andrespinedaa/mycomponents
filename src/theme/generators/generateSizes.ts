import type { Theme, ThemeBreakpoints } from "../core/theme.types";
import { buildSlotSelector, generateTokensCSS, resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";

export function generateComponentSizes(
  componentName: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  if (!config?.sizes) return "";
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  let css = "";

  for (const [sizeKey, tokens] of Object.entries(config.sizes)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;

    const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
    if (!body) continue;

    const base = buildSlotSelector(resolvedName);
    css += `${base}[data-size="${sizeKey}"]{${body}}`;

    for (const bp of Object.keys(theme.breakpoints) as (keyof ThemeBreakpoints)[]) {
      const bpValue = theme.breakpoints[bp];
      if (!bpValue) continue;
      css += `@media(min-width:${bpValue}){${base}[data-size-${bp}="${sizeKey}"]{${body}}}`;
    }
  }

  return css;
}
