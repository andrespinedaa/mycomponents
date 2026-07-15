import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_DATA } from "./system-css.data";
import type { Theme } from "../core/theme.types";
import { resolveTokenValue } from "./generateVariants";

// Runtime-permisivo: los generadores reciben cualquier subconjunto de ThemeComponentOptions
// (siempre hay null-guards por campo), aunque el contrato de autoría (ThemeComponentConfig)
// exija `sizes`. Evita que fixtures de test que aíslan un solo generador deban declarar sizes.
export type GeneratorConfig = Partial<NonNullable<Theme["components"]>[string]>;

export function resolveGeneratorNames(
  componentName: string,
  config: GeneratorConfig,
): { resolvedName: string; prefix: string; parentPrefix: string | undefined } {
  const resolvedName = config?.componentName ?? componentName;
  const parentPrefix = config?.parentName ? camelToKebab(config.parentName) : undefined;
  const prefix = camelToKebab(resolvedName);
  return { resolvedName, prefix, parentPrefix };
}

export function buildSlotSelector(resolvedName: string, parentName?: string): string {
  const self = `[data-slot="${resolvedName}"]`;
  return parentName ? `${self}[data-slot-parent="${parentName}"]` : self;
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

// Resuelve $prop → var(--target-css-prop).
// Sin prefixParent: apunta al propio prefix del componente (auto-referencia).
// Con prefixParent: apunta al prefix del padre (referencia cross-componente explícita).
function resolveDollarProps(value: string, prefix: string, prefixParent: string | undefined): string {
  const target = prefixParent ?? prefix;
  return value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, target)})`);
}

// Resuelve $prop → var(--prefix-css-prop) en los valores de un VarsProp en runtime.
// Usa el prefix propio del componente (no prefixParent).
export function resolveVarsDSL(
  vars: Record<string, string> | undefined,
  prefix: string,
): Record<string, string> | undefined {
  if (!vars) return vars;
  const result: Record<string, string> = {};
  let changed = false;
  for (const [key, value] of Object.entries(vars)) {
    if (value.includes("$")) {
      result[key] = value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, prefix)})`);
      changed = true;
    } else {
      result[key] = value;
    }
  }
  return changed ? result : vars;
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

    if (strValue.includes("$")) {
      css += `${resolveVarName(key, prefix)}:${resolveDollarProps(strValue, prefix, prefixParent)};`;
      continue;
    }

    css += `${resolveVarName(key, prefix)}:${resolveTokenValue(key, strValue, theme)};`;
  }
  return css;
}
