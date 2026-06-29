import { camelToKebab } from "../../utils/string";
import type { Theme } from "../theme.types";
import { getCssProp, resolveVarName } from "./css-gen-utils";

export function generateComponentBases(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
): string {
  if (!config?.variants) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);

  const usedKeys = new Set<string>();
  for (const stateConfig of Object.values(config.variants)) {
    if (!stateConfig) continue;
    for (const tokens of Object.values(stateConfig)) {
      if (!tokens) continue;
      for (const key of Object.keys(tokens)) usedKeys.add(key);
    }
  }

  if (usedKeys.size === 0) return "";

  let css = `[data-slot="${componentName}"]{`;
  for (const key of usedKeys) {
    css += `${camelToKebab(getCssProp(key))}:var(${resolveVarName(key, prefix)},unset);`;
  }
  return css + "}";
}

export function generateBases(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponentBases(name, config))
    .join("");
}
