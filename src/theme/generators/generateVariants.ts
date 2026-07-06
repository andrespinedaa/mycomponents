import type { ComponentStates, StylePropsTokens, Theme, VariantStates } from "../";
import { resolveValue } from "../../system/resolve-value";
import { camelToKebab } from "../../utils/string";
import { generateTokensCSS } from "./css-gen-utils";
import { STYLE_PROPS_DATA } from "./system-css.data";

export function resolveTokenValue(key: string, value: string, theme: Theme): string {
  const def = STYLE_PROPS_DATA[key];
  if (!def || def.category === "raw") return value;
  return resolveValue(value, def.category, theme);
}

const STATE_SELECTORS: Record<ComponentStates, string> = {
  base: "",
  hover: ":hover",
  focus: ":focus-visible",
  active: ":active",
  disabled: "[data-disabled]",
  loading: "[data-loading]",
  selected: "[data-selected]",
  checked: "[data-checked]",
  invalid: "[data-invalid]",
};

export function generateComponentVariants(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.variants) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  let css = "";

  for (const [variant, stateConfig] of Object.entries(config.variants)) {
    if (!stateConfig) continue;

    for (const [state, tokens] of Object.entries(stateConfig) as [
      keyof VariantStates,
      StylePropsTokens | undefined,
    ][]) {
      if (!tokens || Object.keys(tokens).length === 0) continue;

      const stateSelector = STATE_SELECTORS[state] ?? "";
      const selector = `[data-slot="${componentName}"][data-variant="${variant}"]${stateSelector}`;

      const body = generateTokensCSS(tokens, prefix, theme);
      if (body) css += `${selector}{${body}}`;
    }
  }

  return css;
}

export function generateVariants(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponentVariants(name, config, theme))
    .join("");
}
