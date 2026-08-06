import type { Theme } from "../core/theme.types";
import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_FLAT } from "./system-css.data";

const StylePropsResponsive: string[] = Array.from(
  new Set(STYLE_PROPS_FLAT.filter((entry) => entry.responsive).map((entry) => entry.prop)),
);

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
  for (const cssProp of StylePropsResponsive) {
    const varKey = camelToKebab(cssProp);
    css += `${varKey}:var(--${varKey}-base,unset);`;
  }
  css += "}";

  activeBps.forEach((bp, idx) => {
    const bpsUpToHere = activeBps.slice(0, idx + 1);
    css += `@media(min-width:${breakpoints[bp as keyof typeof breakpoints]}){[data-responsive="true"]{`;
    for (const cssProp of StylePropsResponsive) {
      const varKey = camelToKebab(cssProp);
      css += `${varKey}:${buildFallbackChain(varKey, bpsUpToHere)};`;
    }
    css += "}}";
  });

  return css;
}
