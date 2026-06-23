import { STYLE_PROPS_DATA } from "./system-css.data";
import { camelToKebab } from "./generateVariants";
import type { Theme } from "../theme.types";

function resolveVarName(key: string, prefix: string): string {
  const def = STYLE_PROPS_DATA[key];
  return def
    ? `--${prefix}-${camelToKebab(def.properties[0])}`
    : `--${prefix}-${camelToKebab(key)}`;
}

function getCssProp(key: string): string {
  return STYLE_PROPS_DATA[key]?.properties[0] ?? key;
}

export function generateBases(theme: Theme): string {
  if (!theme.components) return "";
  let css = "";

  for (const [componentName, config] of Object.entries(theme.components)) {
    if (!config?.variants) continue;
    const prefix = config.prefix ?? camelToKebab(componentName);

    const usedKeys = new Set<string>();
    for (const stateConfig of Object.values(config.variants)) {
      if (!stateConfig) continue;
      for (const tokens of Object.values(stateConfig)) {
        if (!tokens) continue;
        for (const key of Object.keys(tokens)) usedKeys.add(key);
      }
    }

    if (usedKeys.size === 0) continue;

    css += `[data-slot="${componentName}"]{`;
    for (const key of usedKeys) {
      css += `${camelToKebab(getCssProp(key))}:var(${resolveVarName(key, prefix)},unset);`;
    }
    css += "}";
  }

  return css;
}
