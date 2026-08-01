import { camelToKebab } from "../../utils/string";
import { buildSlotSelector, resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";
import { STYLE_PROPS_DATA } from "./system-css.data";
import { STATE_SELECTORS } from "./generateVariants";

function isStateKey(key: string): boolean {
  return key in STATE_SELECTORS;
}

function collectStyledBlockKeys(block: Record<string, unknown>, usedKeys: Set<string>): void {
  for (const [key, value] of Object.entries(block)) {
    if (value == null) continue;
    if (typeof value !== "object") {
      usedKeys.add(key);
    } else if (isStateKey(key)) {
      collectStyledBlockKeys(value as Record<string, unknown>, usedKeys);
    } else {
      collectStyledBlockKeys(value as Record<string, unknown>, usedKeys);
    }
  }
}

function collectSlotsConfig(slots: Record<string, unknown>, usedKeys: Set<string>): void {
  for (const slotVal of Object.values(slots)) {
    if (!slotVal || typeof slotVal !== "object") continue;
    collectSlotEntry(slotVal as Record<string, unknown>, usedKeys);
  }
}

function collectSlotEntry(slot: Record<string, unknown>, usedKeys: Set<string>): void {
  for (const [key, value] of Object.entries(slot)) {
    if (key === "presets") {
      if (!value || typeof value !== "object") continue;
      for (const presetVal of Object.values(value as Record<string, unknown>)) {
        if (presetVal && typeof presetVal === "object") {
          collectStyledBlockKeys(presetVal as Record<string, unknown>, usedKeys);
        }
      }
      continue;
    }
    if (value == null) continue;
    if (typeof value !== "object") {
      usedKeys.add(key);
    } else if (isStateKey(key)) {
      collectStyledBlockKeys(value as Record<string, unknown>, usedKeys);
    }
  }
}

export function generateComponentBases(
  name: string,
  config: GeneratorConfig,
): string {
  if (!config?.variants && !config?.sizes && !config?.presets && !config?.slots) return "";
  const { resolvedName, prefix } = resolveGeneratorNames(name, config);

  const usedKeys = new Set<string>();

  if (config.variants) {
    collectStyledBlockKeys(config.variants as Record<string, unknown>, usedKeys);
  }

  for (const tokens of Object.values(config.sizes ?? {})) {
    if (!tokens) continue;
    for (const key of Object.keys(tokens)) usedKeys.add(key);
  }

  for (const tokens of Object.values(config.presets ?? {})) {
    if (!tokens) continue;
    for (const key of Object.keys(tokens)) usedKeys.add(key);
  }

  if (config.slots) {
    collectSlotsConfig(config.slots as Record<string, unknown>, usedKeys);
  }

  if (config.orientation) {
    for (const tokens of Object.values(config.orientation)) {
      if (!tokens || typeof tokens !== "object") continue;
      for (const [key, value] of Object.entries(tokens as Record<string, unknown>)) {
        if (typeof value !== "object") usedKeys.add(key);
      }
    }
  }

  if (usedKeys.size === 0) return "";

  const selector = buildSlotSelector(resolvedName);
  let css = `${selector}{`;
  for (const key of usedKeys) {
    const properties = STYLE_PROPS_DATA[key]?.properties ?? [key];
    for (const prop of properties) {
      const kebab = camelToKebab(prop);
      css += `${kebab}:var(--${prefix}-${kebab},unset);`;
    }
  }
  return css + "}";
}
