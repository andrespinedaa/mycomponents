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

export function generateComponentPresets(
  componentName: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  const { resolvedName, prefix, parentPrefix } = resolveGeneratorNames(componentName, config);
  const base = buildSlotSelector(resolvedName, config.parentName);
  let css = "";

  // ── flat presets: [data-set="X"] ────────────────────────────────────────────
  if (config.presets) {
    for (const [presetName, tokens] of Object.entries(config.presets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, parentPrefix);
      if (!body) continue;
      css += `${base}[data-set="${presetName}"]{${body}}`;
    }
  }

  // ── sections: SectionsConfig schema ──────────────────────────────────────────
  if (config.sections) {
    const sectionsObj = config.sections as Record<string, unknown>;

    // ① Sections root — flat tokens + states → [data-slot="X"]
    //    (base compartida: aplica a TODOS los slots del componente)
    const { flat: rootFlat, states: rootStates } = partitionEntry(sectionsObj, ["slots"]);
    const rootBody = generateTokensCSS(rootFlat, prefix, theme, parentPrefix);
    if (rootBody) css += `${base}{${rootBody}}`;
    css += emitStateRules(base, rootStates, prefix, theme, parentPrefix);

    // ② Slots — por nombre → [data-slot="X"][data-section="Y"]
    const slotsMap = sectionsObj["slots"] as Record<string, unknown> | undefined;
    if (slotsMap) {
      for (const [slotName, slotVal] of Object.entries(slotsMap)) {
        if (!slotVal || typeof slotVal !== "object") continue;
        const slotObj = slotVal as Record<string, unknown>;
        const slotSelector = `${base}[data-section="${slotName}"]`;

        const { flat: slotFlat, states: slotStates } = partitionEntry(slotObj, ["presets"]);
        const slotBody = generateTokensCSS(slotFlat, prefix, theme, parentPrefix);
        if (slotBody) css += `${slotSelector}{${slotBody}}`;
        css += emitStateRules(slotSelector, slotStates, prefix, theme, parentPrefix);

        // ③ Sets del slot → [data-slot="X"][data-section="Y"][data-set="Z"]
        const presetsMap = slotObj["presets"] as Record<string, unknown> | undefined;
        if (presetsMap) {
          for (const [presetName, presetVal] of Object.entries(presetsMap)) {
            if (!presetVal || typeof presetVal !== "object") continue;
            const presetSelector = `${slotSelector}[data-set="${presetName}"]`;
            const { flat: pFlat, states: pStates } = partitionEntry(
              presetVal as Record<string, unknown>,
            );
            const presetBody = generateTokensCSS(pFlat, prefix, theme, parentPrefix);
            if (presetBody) css += `${presetSelector}{${presetBody}}`;
            css += emitStateRules(presetSelector, pStates, prefix, theme, parentPrefix);
          }
        }
      }
    }
  }

  return css;
}
