import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_DATA } from "./system-css.data";
import type { Theme } from "../core/theme.types";
import { resolveTokenValue } from "./generateVariants";

export type GeneratorConfig = Partial<NonNullable<Theme["components"]>[string]>;

export function resolveGeneratorNames(
  name: string,
  config: GeneratorConfig,
): { resolvedName: string; prefix: string; parentPrefix: string | undefined } {
  const resolvedName = config?.name ?? name;
  const parentPrefix = config?.parentName ? camelToKebab(config.parentName) : undefined;
  const prefix = camelToKebab(resolvedName);
  return { resolvedName, prefix, parentPrefix };
}

export function buildSlotSelector(resolvedName: string): string {
  return `[data-slot="${resolvedName}"]`;
}

export function resolveVarName(key: string, prefix: string): string {
  const def = STYLE_PROPS_DATA[key];
  return def
    ? `--${prefix}-${camelToKebab(def.properties[0])}`
    : `--${prefix}-${camelToKebab(key)}`;
}

export function getCssProp(key: string): string {
  return STYLE_PROPS_DATA[key]?.properties[0] ?? camelToKebab(key);
}

function resolveDollarProps(value: string, prefix: string, prefixParent: string | undefined): string {
  const target = prefixParent ?? prefix;
  return value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, target)})`);
}

export function generateTokensCSS(
  tokens: Record<string, unknown>,
  prefix: string,
  theme: Theme,
  prefixParent?: string,
): string {
  let css = "";
  for (const [key, value] of Object.entries(tokens)) {
    if (value == null) continue;
    const strValue = String(value);
    const properties = STYLE_PROPS_DATA[key]?.properties ?? [key];

    if (strValue.includes("$")) {
      const resolved = resolveDollarProps(strValue, prefix, prefixParent);
      for (const prop of properties) {
        css += `--${prefix}-${camelToKebab(prop)}:${resolved};`;
      }
      continue;
    }

    const resolved = resolveTokenValue(key, strValue, theme);
    for (const prop of properties) {
      css += `--${prefix}-${camelToKebab(prop)}:${resolved};`;
    }
  }
  return css;
}
