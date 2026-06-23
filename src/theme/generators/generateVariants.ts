import type { Theme } from "../theme.types";
import type { VariantStateConfig, VariantTokens } from "../theme.variants";
import { STYLE_PROPS_DATA } from "./system-css.data";

export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function resolveVarName(key: string, prefix: string): string {
  const def = STYLE_PROPS_DATA[key];
  if (def) {
    // es un alias de StyleProps — usa la primera CSS prop real
    return `--${prefix}-${camelToKebab(def.properties[0])}`;
  }
  // es una CSS prop directa (cursor, outline, etc.)
  return `--${prefix}-${camelToKebab(key)}`;
}

const STATE_SELECTORS: Record<keyof VariantStateConfig, string> = {
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

export function generateVariants(theme: Theme): string {
  if (!theme.components) return "";
  let css = "";

  for (const [componentName, config] of Object.entries(theme.components)) {
    if (!config?.variants) continue;
    const prefix = config.prefix ?? camelToKebab(componentName);

    for (const [variant, stateConfig] of Object.entries(config.variants)) {
      if (!stateConfig) continue;

      for (const [state, tokens] of Object.entries(stateConfig) as [
        keyof VariantStateConfig,
        VariantTokens | undefined,
      ][]) {
        if (!tokens || Object.keys(tokens).length === 0) continue;

        const stateSelector = STATE_SELECTORS[state] ?? "";
        const selector = `[data-slot="${componentName}"][data-variant="${variant}"]${stateSelector}`;

        css += `${selector}{`;
        for (const [key, value] of Object.entries(tokens)) {
          css += `${resolveVarName(key, prefix)}:${value};`;
        }
        css += "}";
      }
    }
  }

  return css;
}
