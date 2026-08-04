import type { Theme, ThemeBreakpoints } from "../core/theme.types";
import { buildSlotSelector, generateTokensCSS, type GeneratorNames } from "./css-gen-utils";

export function generateComponentSizes(
  names: GeneratorNames,
  sizes: Record<string, Record<string, unknown>> | undefined,
  theme: Theme,
  tokenVars: Record<string, string>,
): string {
  if (!sizes) return "";
  const { resolvedName, prefix, parentPrefix } = names;
  const base = buildSlotSelector(resolvedName);
  let css = "";

  for (const [sizeKey, tokens] of Object.entries(sizes)) {
    if (Object.keys(tokens).length === 0) continue;

    const body = generateTokensCSS(tokens, prefix, tokenVars, parentPrefix);
    if (!body) continue;

    css += `${base}[data-size="${sizeKey}"]{${body}}`;

    for (const bp of Object.keys(theme.breakpoints) as (keyof ThemeBreakpoints)[]) {
      const bpValue = theme.breakpoints[bp];
      if (!bpValue) continue;
      css += `@media(min-width:${bpValue}){${base}[data-size-${bp}="${sizeKey}"]{${body}}}`;
    }
  }

  return css;
}
