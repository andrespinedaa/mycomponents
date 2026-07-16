import type { ComponentStates, Theme } from "../core/theme.types";
import { buildSlotSelector, generateTokensCSS, resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";
import { emitStateRules, isStateKey } from "./generateVariants";

// Partitions an object into: flat CSS tokens, state entries, and named structural keys (skipped).
function partitionEntry(
  obj: Record<string, unknown>,
  skipKeys: string[] = [],
): {
  flat: Record<string, unknown>;
  states: Array<[ComponentStates, Record<string, unknown>]>;
} {
  const flat: Record<string, unknown> = {};
  const states: Array<[ComponentStates, Record<string, unknown>]> = [];

  for (const [key, value] of Object.entries(obj)) {
    if (skipKeys.includes(key)) continue;
    if (value == null) continue;
    if (typeof value !== "object") {
      flat[key] = value;
    } else if (isStateKey(key)) {
      states.push([key as ComponentStates, value as Record<string, unknown>]);
    }
    // non-state objects not in skipKeys are ignored here (handled by caller)
  }
  return { flat, states };
}

// Overrides por orientation dentro de un preset → [selector][data-orientation="X"] { ... }
// Cada bloque de orientation es un StyledBlock completo (flat + estados), igual que el preset base.
function emitPresetOrientation(
  selector: string,
  orientationMap: Record<string, unknown> | undefined,
  prefix: string,
  theme: Theme,
  parentPrefix: string | undefined,
): string {
  if (!orientationMap) return "";
  let css = "";
  for (const [orientationKey, block] of Object.entries(orientationMap)) {
    if (!block || typeof block !== "object") continue;
    const orientationSelector = `${selector}[data-orientation="${orientationKey}"]`;
    const { flat, states } = partitionEntry(block as Record<string, unknown>);
    const body = generateTokensCSS(flat, prefix, theme, parentPrefix);
    if (body) css += `${orientationSelector}{${body}}`;
    css += emitStateRules(orientationSelector, states, prefix, theme, parentPrefix);
  }
  return css;
}

// Un preset completo (PresetEntry: StyledBlock + orientation opcional) → selector base + estados +
// overrides por orientation. Compartido por presets de nivel componente y de nivel slot.
function emitPreset(
  selector: string,
  tokens: Record<string, unknown>,
  prefix: string,
  theme: Theme,
  parentPrefix: string | undefined,
): string {
  const { flat, states } = partitionEntry(tokens, ["orientation"]);
  let css = "";
  const body = generateTokensCSS(flat, prefix, theme, parentPrefix);
  if (body) css += `${selector}{${body}}`;
  css += emitStateRules(selector, states, prefix, theme, parentPrefix);
  css += emitPresetOrientation(
    selector,
    tokens["orientation"] as Record<string, unknown> | undefined,
    prefix,
    theme,
    parentPrefix,
  );
  return css;
}

export function generateComponentPresets(
  componentName: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const base = buildSlotSelector(resolvedName);
  let css = "";

  // ── presets de nivel componente: [data-slot="X"][data-set="Y"] ────────────────────
  if (config.presets) {
    for (const [presetName, tokens] of Object.entries(config.presets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      css += emitPreset(
        `${base}[data-set="${presetName}"]`,
        tokens as Record<string, unknown>,
        prefix,
        theme,
        parentPrefix,
      );
    }
  }

  // ── slots: mapa directo nombre → SlotEntry → [data-slot="X"][data-section="Y"] ────
  if (config.slots) {
    for (const [slotName, slotVal] of Object.entries(config.slots)) {
      if (!slotVal || typeof slotVal !== "object") continue;
      const slotObj = slotVal as Record<string, unknown>;
      const slotSelector = `${base}[data-section="${slotName}"]`;

      const { flat: slotFlat, states: slotStates } = partitionEntry(slotObj, ["presets"]);
      const slotBody = generateTokensCSS(slotFlat, prefix, theme, parentPrefix);
      if (slotBody) css += `${slotSelector}{${slotBody}}`;
      css += emitStateRules(slotSelector, slotStates, prefix, theme, parentPrefix);

      // Presets del slot → [data-slot="X"][data-section="Y"][data-set="Z"]
      const presetsMap = slotObj["presets"] as Record<string, unknown> | undefined;
      if (presetsMap) {
        for (const [presetName, presetVal] of Object.entries(presetsMap)) {
          if (!presetVal || typeof presetVal !== "object") continue;
          css += emitPreset(
            `${slotSelector}[data-set="${presetName}"]`,
            presetVal as Record<string, unknown>,
            prefix,
            theme,
            parentPrefix,
          );
        }
      }
    }
  }

  return css;
}
