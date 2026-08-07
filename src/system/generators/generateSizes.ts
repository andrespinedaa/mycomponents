import type { Theme, ThemeBreakpoints, VarsCss } from "../../theme/theme.types";
import { generateTokensCSS } from "./css-gen-utils";
import type { GeneratorNames } from "./generateComponents";

export function generateSizes(
  names: GeneratorNames,
  sizes: Record<string, Record<string, unknown>> | undefined,
  theme: Theme,
  tokenVars: VarsCss,
): string {
  if (!sizes) return "";
  let css = "";

  for (const [sizeKey, tokens] of Object.entries(sizes)) {
    if (Object.keys(tokens).length === 0) continue;

    const body = generateTokensCSS(tokens, names.prefix, tokenVars, names.parentPrefix);
    if (!body) continue;

    css += `${names.selector}[data-size="${sizeKey}"]{${body}}`;

    for (const bp of Object.keys(theme.breakpoints) as (keyof ThemeBreakpoints)[]) {
      const bpValue = theme.breakpoints[bp];
      if (!bpValue) continue;
      css += `@media(min-width:${bpValue}){${names.selector}[data-size-${bp}="${sizeKey}"]{${body}}}`;
    }
  }

  return css;
}
