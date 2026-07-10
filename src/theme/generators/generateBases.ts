import { camelToKebab } from "../../utils/string";
import type { Theme } from "../core/theme.types";
import { buildSlotSelector, resolveGeneratorNames } from "./css-gen-utils";
import { getCssProp, resolveVarName } from "./css-gen-utils";

export function generateComponentBases(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
): string {
  if (!config?.variants && !config?.sizes && !config?.presets) return "";
  const { resolvedName, prefix } = resolveGeneratorNames(componentName, config);

  const usedKeys = new Set<string>();

  for (const stateConfig of Object.values(config.variants ?? {})) {
    if (!stateConfig) continue;
    for (const tokens of Object.values(stateConfig)) {
      if (!tokens) continue;
      for (const key of Object.keys(tokens)) usedKeys.add(key);
    }
  }

  for (const tokens of Object.values(config.sizes ?? {})) {
    if (!tokens) continue;
    for (const key of Object.keys(tokens)) usedKeys.add(key);
  }

  for (const tokens of Object.values(config.presets ?? {})) {
    if (!tokens) continue;
    for (const key of Object.keys(tokens)) usedKeys.add(key);
  }

  if (usedKeys.size === 0) return "";

  const selector = buildSlotSelector(resolvedName, config.parentName);
  let css = `${selector}{`;
  for (const key of usedKeys) {
    css += `${camelToKebab(getCssProp(key))}:var(${resolveVarName(key, prefix)},unset);`;
  }
  return css + "}";
}
