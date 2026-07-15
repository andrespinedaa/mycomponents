import type { OrientationProp } from "../../factory/core";
import type { Theme } from "../core/theme.types";
import {
  buildSlotSelector,
  generateTokensCSS,
  resolveGeneratorNames,
  resolveVarName,
  type GeneratorConfig,
} from "./css-gen-utils";
import { resolveTokenValue } from "./generateVariants";

const DOLLAR_PROP_RE = /\$(\w+)/g;

// $prop dentro de orientation se resuelve por-size contra `sizes` (literal, build-time) —
// nunca como var() en runtime, porque swap de dos custom properties en la misma regla es cíclico e inválido en CSS.
function resolveSizeAwareBody(
  sizeAware: Record<string, string>,
  sizeTokens: Record<string, unknown>,
  prefix: string,
  theme: Theme,
): string {
  let body = "";
  for (const [key, dslValue] of Object.entries(sizeAware)) {
    const resolved = dslValue.replace(DOLLAR_PROP_RE, (_, prop) => {
      const raw = sizeTokens[prop];
      return raw == null ? "" : resolveTokenValue(prop, String(raw), theme);
    });
    if (!resolved || resolved.includes("$")) continue;
    body += `${resolveVarName(key, prefix)}:${resolved};`;
  }
  return body;
}

export function generateComponentOrientation(
  componentName: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  if (!config?.orientation) return "";
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const base = buildSlotSelector(resolvedName, config.parentName);
  let css = "";

  for (const [orientationKey, tokens] of Object.entries(config.orientation) as Array<
    [OrientationProp, Record<string, unknown> | undefined]
  >) {
    if (!tokens || Object.keys(tokens).length === 0) continue;

    const flat: Record<string, unknown> = {};
    const sizeAware: Record<string, string> = {};

    for (const [key, value] of Object.entries(tokens)) {
      if (value == null) continue;
      if (typeof value === "string" && config.sizes && DOLLAR_PROP_RE.test(value)) {
        sizeAware[key] = value;
      } else {
        flat[key] = value;
      }
      DOLLAR_PROP_RE.lastIndex = 0; // reset — .test() con /g muta lastIndex
    }

    const orientationSelector = `${base}[data-orientation="${orientationKey}"]`;

    const flatBody = generateTokensCSS(flat, prefix, theme, parentPrefix);
    if (flatBody) css += `${orientationSelector}{${flatBody}}`;

    if (Object.keys(sizeAware).length > 0 && config.sizes) {
      for (const [sizeKey, sizeTokens] of Object.entries(config.sizes)) {
        if (!sizeTokens) continue;
        const body = resolveSizeAwareBody(sizeAware, sizeTokens as Record<string, unknown>, prefix, theme);
        if (body) css += `${orientationSelector}[data-size="${sizeKey}"]{${body}}`;
      }
    }
  }

  return css;
}
