import type { Theme } from "../core/theme.types";
import { RESPONSIVE_CSS_PROPS } from "./system-css.data";
import { camelToKebab } from "../../utils/string";

function buildFallbackChain(varKey: string, bps: string[]): string {
  let chain = `var(--${varKey}-base)`;
  for (const bp of bps) {
    chain = `var(--${varKey}-${bp}, ${chain})`;
  }
  return chain;
}

export function generateResponsive(theme: Theme): string {
  const { breakpoints } = theme;
  const activeBps = Object.keys(breakpoints);

  let css = "";

  css += '[data-responsive="true"]{';
  for (const cssProp of RESPONSIVE_CSS_PROPS) {
    const varKey = camelToKebab(cssProp);
    css += `${varKey}:var(--${varKey}-base,unset);`;
  }
  css += "}";

  activeBps.forEach((bp, idx) => {
    const bpsUpToHere = activeBps.slice(0, idx + 1);
    css += `@media(min-width:${breakpoints[bp as keyof typeof breakpoints]}){[data-responsive="true"]{`;
    for (const cssProp of RESPONSIVE_CSS_PROPS) {
      const varKey = camelToKebab(cssProp);
      css += `${varKey}:${buildFallbackChain(varKey, bpsUpToHere)};`;
    }
    css += "}}";
  });

  return css;
}
