import { camelToKebab } from "../../utils/string";
import { DOLLAR_DSL, STYLE_PROPS_LOOKUP } from "../../system/system-css.data";
import { resolveValue } from "../../factory/resolvers/resolve-value";
import type { Theme, VarsCss } from "../core/theme.types";
import type { ComponentName } from "../core/theme.components.types";

export type UsedKeys = Set<string>;

export type GeneratorConfig = NonNullable<NonNullable<Theme["components"]>[ComponentName]>;

export function resolveVarName(key: string, prefix: string): string {
  const def = STYLE_PROPS_LOOKUP[key];
  return def
    ? `--${prefix}-${camelToKebab(def.properties[0])}`
    : `--${prefix}-${camelToKebab(key)}`;
}

export function getCssProp(key: string): string {
  return STYLE_PROPS_LOOKUP[key]?.properties[0] ?? camelToKebab(key);
}

// ── moved from generateVariants ───────────────────────────────────────────────

export function resolveTokenValue(
  key: string,
  value: string,
  tokenVars: Record<string, string>,
): string {
  const def = STYLE_PROPS_LOOKUP[key];
  if (!def || def.category === "raw") return value;
  return resolveValue(value, def.category, tokenVars);
}

// ─────────────────────────────────────────────────────────────────────────────

function resolveDollarProps(
  value: string,
  prefix: string,
  prefixParent: string | undefined,
): string {
  const target = prefixParent ?? prefix;
  return value.replace(DOLLAR_DSL, (_, prop) => `var(${resolveVarName(prop, target)})`);
}

export function generateTokensCSS(
  tokens: Record<string, unknown>,
  prefix: string,
  tokenVars: VarsCss,
  prefixParent?: string,
): string {
  let css = "";
  for (const [key, value] of Object.entries(tokens)) {
    if (value == null) continue;
    const strValue = String(value);
    const properties = STYLE_PROPS_LOOKUP[key]?.properties ?? [key];

    if (strValue.includes("$")) {
      const resolved = resolveDollarProps(strValue, prefix, prefixParent);
      for (const prop of properties) {
        css += `--${prefix}-${camelToKebab(prop)}:${resolved};`;
      }
      continue;
    }

    const resolved = resolveTokenValue(key, strValue, tokenVars);
    for (const prop of properties) {
      css += `--${prefix}-${camelToKebab(prop)}:${resolved};`;
    }
  }
  return css;
}
