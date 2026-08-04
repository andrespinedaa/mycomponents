import {
  buildSlotSelector,
  generateTokensCSS,
  resolveTokenValue,
  resolveVarName,
  type GeneratorNames,
} from "./css-gen-utils";
import type { ParsedOrientationEntry } from "./parseComponentConfig";

const DOLLAR_PROP_RE = /\$(\w+)/g;

// $prop dentro de orientation se resuelve por-size contra `sizes` (literal, build-time) —
// nunca como var() en runtime, porque swap de dos custom properties en la misma regla es cíclico e inválido en CSS.
function resolveSizeAwareBody(
  sizeAware: Record<string, string>,
  sizeTokens: Record<string, unknown>,
  prefix: string,
  tokenVars: Record<string, string>,
): string {
  let body = "";
  for (const [key, dslValue] of Object.entries(sizeAware)) {
    const resolved = dslValue.replace(DOLLAR_PROP_RE, (_, prop) => {
      const raw = sizeTokens[prop];
      return raw == null ? "" : resolveTokenValue(prop, String(raw), tokenVars);
    });
    DOLLAR_PROP_RE.lastIndex = 0;
    if (!resolved || resolved.includes("$")) continue;
    body += `${resolveVarName(key, prefix)}:${resolved};`;
  }
  return body;
}

export function generateComponentOrientation(
  names: GeneratorNames,
  orientation: Record<string, ParsedOrientationEntry> | undefined,
  sizes: Record<string, Record<string, unknown>> | undefined,
  tokenVars: Record<string, string>,
): string {
  if (!orientation) return "";
  const { resolvedName, prefix, parentPrefix } = names;
  const base = buildSlotSelector(resolvedName);
  let css = "";

  for (const [orientationKey, { flat, sizeAware }] of Object.entries(orientation)) {
    const orientationSelector = `${base}[data-orientation="${orientationKey}"]`;

    const flatBody = generateTokensCSS(flat, prefix, tokenVars, parentPrefix);
    if (flatBody) css += `${orientationSelector}{${flatBody}}`;

    if (Object.keys(sizeAware).length > 0 && sizes) {
      for (const [sizeKey, sizeTokens] of Object.entries(sizes)) {
        const body = resolveSizeAwareBody(sizeAware, sizeTokens, prefix, tokenVars);
        if (body) css += `${orientationSelector}[data-size="${sizeKey}"]{${body}}`;
      }
    }
  }

  return css;
}
