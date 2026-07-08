import type { Theme, ThemeBreakpoints } from "../core/theme.types";
import { camelToKebab } from "../../utils/string";
import { generateTokensCSS } from "./css-gen-utils";

export function generateComponentSizes(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.sizes) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  let css = "";

  for (const [sizeKey, tokens] of Object.entries(config.sizes)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;

    const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, config.prefixParent);
    if (!body) continue;

    // ─── Estático: [data-slot="X"][data-size="sm"] ────────────────────────
    css += `[data-slot="${componentName}"][data-size="${sizeKey}"]{${body}}`;

    // ─── Responsive: @media(min-width) { [data-size-{bp}="sm"] } ─────────
    for (const bp of Object.keys(theme.breakpoints) as (keyof ThemeBreakpoints)[]) {
      const bpValue = theme.breakpoints[bp];
      if (!bpValue) continue;
      css += `@media(min-width:${bpValue}){[data-slot="${componentName}"][data-size-${bp}="${sizeKey}"]{${body}}}`;
    }
  }

  return css;
}

export function generateSizes(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponentSizes(name, config, theme))
    .join("");
}
