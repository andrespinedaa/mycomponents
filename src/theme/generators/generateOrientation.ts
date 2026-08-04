import type { VarsCss } from "../core";
import { generateTokensCSS, resolveTokenValue, resolveVarName } from "./css-gen-utils";
import type { GeneratorNames } from "./generateComponents";
import type { ParsedOrientationEntry } from "./parseComponentConfig";
import { DOLLAR_DSL } from "./system-css.data";

function resolveSizeAwareBody(
  sizeAware: Record<string, string>,
  sizeTokens: Record<string, unknown>,
  prefix: string,
  tokenVars: Record<string, string>,
): string {
  let body = "";
  for (const [key, dslValue] of Object.entries(sizeAware)) {
    const resolved = dslValue.replace(DOLLAR_DSL, (_, prop) => {
      const raw = sizeTokens[prop];
      return raw == null ? "" : resolveTokenValue(prop, String(raw), tokenVars);
    });
    DOLLAR_DSL.lastIndex = 0;
    if (!resolved || resolved.includes("$")) continue;
    body += `${resolveVarName(key, prefix)}:${resolved};`;
  }
  return body;
}

export function generateComponentOrientation(
  names: GeneratorNames,
  orientation: Record<string, ParsedOrientationEntry> | undefined,
  sizes: Record<string, Record<string, unknown>> | undefined,
  tokenVars: VarsCss,
): string {
  if (!orientation) return "";
  let css = "";

  for (const [orientationKey, { flat, sizeAware }] of Object.entries(orientation)) {
    const orientationSelector = `${names.selector}[data-orientation="${orientationKey}"]`;

    const flatBody = generateTokensCSS(flat, names.prefix, tokenVars, names.parentPrefix);
    if (flatBody) css += `${orientationSelector}{${flatBody}}`;

    if (Object.keys(sizeAware).length > 0 && sizes) {
      for (const [sizeKey, sizeTokens] of Object.entries(sizes)) {
        const body = resolveSizeAwareBody(sizeAware, sizeTokens, names.prefix, tokenVars);
        if (body) css += `${orientationSelector}[data-size="${sizeKey}"]{${body}}`;
      }
    }
  }

  return css;
}
