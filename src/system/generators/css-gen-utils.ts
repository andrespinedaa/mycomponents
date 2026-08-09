import { camelToKebab } from "../../utils/string";
import { DOLLAR_DSL, STYLE_PROPS_LOOKUP } from "../system.data";
import { resolveValue } from "../../factory/resolvers/resolve-value";
import type { Theme, VarsCss } from "../../theme/theme.types";
import type { ComponentName } from "../../theme/core/theme.components.types";

export type GeneratorConfig = NonNullable<NonNullable<Theme["components"]>[ComponentName]>;

export function resolveVarNames(key: string, prefix: string): string[] {
  const properties = STYLE_PROPS_LOOKUP[key]?.properties ?? [key];
  return properties.map((prop) => `--${prefix}-${camelToKebab(prop)}`);
}

export function DSLDollar(
  value: string,
  prefix: string,
  prefixParent?: string,
  resolver?: (prop: string) => string,
): string {
  const target = prefixParent ?? prefix;
  const resolve = resolver ?? ((prop: string) => `var(${resolveVarNames(prop, target)[0]})`);
  return value.replace(DOLLAR_DSL, (_, prop) => resolve(prop));
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
    const varNames = resolveVarNames(key, prefix);

    if (strValue.includes("$")) {
      const resolved = DSLDollar(strValue, prefix, prefixParent);
      for (const varName of varNames) {
        css += `${varName}:${resolved};`;
      }
      continue;
    }

    const resolved = resolveTokenValue(key, strValue, tokenVars);
    for (const varName of varNames) {
      css += `${varName}:${resolved};`;
    }
  }
  return css;
}
