import { camelToKebab } from "../../utils/string";
import { STYLE_PROPS_DATA } from "./system-css.data";
import { resolveValue } from "../../system/resolvers/resolve-value";
import type { Theme, ComponentStates } from "../core/theme.types";
import type { ComponentName } from "../core/theme.components.types";

export type GeneratorConfig = NonNullable<NonNullable<Theme["components"]>[ComponentName]>;

export type GeneratorNames = {
  resolvedName: string;
  prefix: string;
  parentPrefix: string | undefined;
};

export function resolveGeneratorNames(
  name: string,
  config: GeneratorConfig,
): GeneratorNames {
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

// ── moved from generateVariants ───────────────────────────────────────────────

// prettier-ignore
export const STATE_SELECTORS: Record<ComponentStates, string> = {
  hover:      ":hover",           focus:        ":focus",             focusVisible: ":focus-visible",
  focusWithin:":focus-within",    active:       ":active",            disabled:     "[data-disabled]",
  checked:    ":checked",         indeterminate:":indeterminate",     required:     ":required",
  invalid:    "[data-invalid]",   valid:        ":valid",             readOnly:     ":read-only",
  placeholder:"::placeholder",    autofill:     ":-webkit-autofill",  loading:      "[data-loading]",
  selected:   "[data-selected]",  before:       "::before",           after:        "::after",
  marker:     "::marker",         firstChild:   ":first-child",       lastChild:    ":last-child",
  empty:      ":empty",           selection:    "::selection",
};

export function isStateKey(key: string): key is ComponentStates {
  return key in STATE_SELECTORS;
}

export function resolveTokenValue(key: string, value: string, tokenVars: Record<string, string>): string {
  const def = STYLE_PROPS_DATA[key];
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
  return value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, target)})`);
}

export function generateTokensCSS(
  tokens: Record<string, unknown>,
  prefix: string,
  tokenVars: Record<string, string>,
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

    const resolved = resolveTokenValue(key, strValue, tokenVars);
    for (const prop of properties) {
      css += `--${prefix}-${camelToKebab(prop)}:${resolved};`;
    }
  }
  return css;
}
