import type { ComponentStates, Theme } from "../";
import { resolveValue } from "../../system/resolve-value";
import { buildSlotSelector, generateTokensCSS, resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";
import { STYLE_PROPS_DATA } from "./system-css.data";

export function resolveTokenValue(key: string, value: string, theme: Theme): string {
  const def = STYLE_PROPS_DATA[key];
  if (!def || def.category === "raw") return value;
  return resolveValue(value, def.category, theme);
}

export const STATE_SELECTORS: Record<ComponentStates, string> = {
  hover:        ":hover",
  focus:        ":focus",
  focusVisible: ":focus-visible",
  focusWithin:  ":focus-within",
  active:       ":active",
  disabled:     "[data-disabled]",
  checked:      ":checked",
  indeterminate:":indeterminate",
  required:     ":required",
  invalid:      "[data-invalid]",
  valid:        ":valid",
  readOnly:     ":read-only",
  placeholder:  "::placeholder",
  autofill:     ":-webkit-autofill",
  loading:      "[data-loading]",
  selected:     "[data-selected]",
  before:       "::before",
  after:        "::after",
  selection:    "::selection",
  marker:       "::marker",
  firstChild:   ":first-child",
  lastChild:    ":last-child",
  empty:        ":empty",
};

export function isStateKey(key: string): key is ComponentStates {
  return key in STATE_SELECTORS;
}

// Separates a StyledBlock into flat CSS tokens, state entries, and variant entries.
function partitionBlock(block: Record<string, unknown>): {
  flat: Record<string, unknown>;
  states: Array<[ComponentStates, Record<string, unknown>]>;
  variants: Array<[string, Record<string, unknown>]>;
} {
  const flat: Record<string, unknown> = {};
  const states: Array<[ComponentStates, Record<string, unknown>]> = [];
  const variants: Array<[string, Record<string, unknown>]> = [];

  for (const [key, value] of Object.entries(block)) {
    if (value == null) continue;
    if (typeof value !== "object") {
      flat[key] = value;
    } else if (isStateKey(key)) {
      states.push([key as ComponentStates, value as Record<string, unknown>]);
    } else {
      // PascalCase → variant
      variants.push([key, value as Record<string, unknown>]);
    }
  }
  return { flat, states, variants };
}

// Separates a StateNode into flat tokens and nested states (2nd level).
function partitionStateNode(node: Record<string, unknown>): {
  flat: Record<string, unknown>;
  nested: Array<[ComponentStates, Record<string, unknown>]>;
} {
  const flat: Record<string, unknown> = {};
  const nested: Array<[ComponentStates, Record<string, unknown>]> = [];

  for (const [key, value] of Object.entries(node)) {
    if (value == null) continue;
    if (typeof value === "object" && isStateKey(key)) {
      nested.push([key as ComponentStates, value as Record<string, unknown>]);
    } else {
      flat[key] = value;
    }
  }
  return { flat, nested };
}

export function emitStateRules(
  selector: string,
  states: Array<[ComponentStates, Record<string, unknown>]>,
  prefix: string,
  theme: Theme,
  parentPrefix: string | undefined,
): string {
  let css = "";
  for (const [stateKey, stateNode] of states) {
    const stateSel = STATE_SELECTORS[stateKey];
    const { flat, nested } = partitionStateNode(stateNode);

    const body = generateTokensCSS(flat, prefix, theme, parentPrefix);
    if (body) css += `${selector}${stateSel}{${body}}`;

    for (const [nestedKey, nestedTokens] of nested) {
      const nestedSel = STATE_SELECTORS[nestedKey];
      const nestedFlat: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(nestedTokens)) {
        if (typeof v !== "object") nestedFlat[k] = v;
      }
      const nestedBody = generateTokensCSS(nestedFlat, prefix, theme, parentPrefix);
      if (nestedBody) css += `${selector}${stateSel}${nestedSel}{${nestedBody}}`;
    }
  }
  return css;
}

export function generateComponentVariants(
  componentName: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  if (!config?.variants) return "";
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const baseSelector = buildSlotSelector(resolvedName);
  let css = "";

  const { flat, states, variants } = partitionBlock(config.variants as Record<string, unknown>);

  // Flat base tokens → [data-slot="X"] { --vars }
  const flatBody = generateTokensCSS(flat, prefix, theme, parentPrefix);
  if (flatBody) css += `${baseSelector}{${flatBody}}`;

  // State tokens at root → [data-slot="X"]:hover { --vars }
  css += emitStateRules(baseSelector, states, prefix, theme, parentPrefix);

  // Variant tokens → [data-slot="X"][data-variant="Y"] { --vars } + states
  for (const [variantName, variantBlock] of variants) {
    const variantSelector = `${baseSelector}[data-variant="${variantName}"]`;
    const { flat: vFlat, states: vStates } = partitionBlock(variantBlock);

    const vFlatBody = generateTokensCSS(vFlat, prefix, theme, parentPrefix);
    if (vFlatBody) css += `${variantSelector}{${vFlatBody}}`;

    css += emitStateRules(variantSelector, vStates, prefix, theme, parentPrefix);
  }

  return css;
}
