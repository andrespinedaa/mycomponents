import { camelToKebab } from "../../utils/string";
import { buildSlotSelector, resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";
import { STYLE_PROPS_DATA } from "./system-css.data";
import { STATE_SELECTORS } from "./generateVariants";

function isStateKey(key: string): boolean {
  return key in STATE_SELECTORS;
}

// Collects all leaf CSS token keys from a StyledBlock (flat + states + variants).
// Recurses into state nodes and variant blocks; skips slots presets (non-state objects
// within slots entries are handled separately in collectSectionKeys).
function collectStyledBlockKeys(block: Record<string, unknown>, usedKeys: Set<string>): void {
  for (const [key, value] of Object.entries(block)) {
    if (value == null) continue;
    if (typeof value !== "object") {
      usedKeys.add(key);
    } else if (isStateKey(key)) {
      // state node — recurse (handles nested states at 2nd level too)
      collectStyledBlockKeys(value as Record<string, unknown>, usedKeys);
    } else {
      // variant block — recurse
      collectStyledBlockKeys(value as Record<string, unknown>, usedKeys);
    }
  }
}

// Collects keys from a SlotsConfig — mapa directo de nombre de slot → SlotEntry (flat+states+presets).
function collectSlotsConfig(slots: Record<string, unknown>, usedKeys: Set<string>): void {
  for (const slotVal of Object.values(slots)) {
    if (!slotVal || typeof slotVal !== "object") continue;
    collectSlotEntry(slotVal as Record<string, unknown>, usedKeys);
  }
}

// Collects keys from a SlotEntry: flat+states + presets (each a StyledBlock).
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
  componentName: string,
  config: GeneratorConfig,
): string {
  if (!config?.variants && !config?.sizes && !config?.presets && !config?.slots) return "";
  const { resolvedName, prefix } = resolveGeneratorNames(componentName, config);

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
