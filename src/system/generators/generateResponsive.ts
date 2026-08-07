import type { Theme } from "../../theme/theme.types";
import { getSortedBreakpoints } from "../../theme/core/resolveBreakpoints";
import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_FLAT } from "../system.data";

const StylePropsResponsive: string[] = Array.from(
  new Set(STYLE_PROPS_FLAT.filter((entry) => entry.responsive).map((entry) => entry.prop)),
);

function buildFallbackChain(varKey: string, bps: string[]): string {
  let chain = "unset";
  for (const bp of bps) {
    chain = `var(--${varKey}-${bp}, ${chain})`;
  }
  return chain;
}

export function generateResponsive(theme: Theme): string {
  const activeBps = getSortedBreakpoints(theme).map(([name]) => name);
  const minWidths = Object.fromEntries(getSortedBreakpoints(theme));

  let css = "";

  activeBps.forEach((bp, idx) => {
    const bpsUpToHere = activeBps.slice(0, idx + 1);
    const minWidth = idx === 0 ? "0px" : minWidths[bp];
    css += `@media(min-width:${minWidth}){[data-responsive="true"]{`;
    for (const cssProp of StylePropsResponsive) {
      const varKey = camelToKebab(cssProp);
      css += `${varKey}:${buildFallbackChain(varKey, bpsUpToHere)};`;
    }
    css += "}}";
  });

  return css;
}
