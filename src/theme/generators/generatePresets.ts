import { buildSlotSelector, type GeneratorNames } from "./css-gen-utils";
import { emitBlock } from "./generateVariants";
import type { ParsedPreset, ParsedSlot } from "./parseComponentConfig";

function emitPreset(
  selector: string,
  preset: ParsedPreset,
  prefix: string,
  tokenVars: Record<string, string>,
  parentPrefix: string | undefined,
): string {
  let css = emitBlock(selector, preset, prefix, tokenVars, parentPrefix);
  if (preset.orientation) {
    for (const [orientationKey, block] of Object.entries(preset.orientation)) {
      css += emitBlock(
        `${selector}[data-orientation="${orientationKey}"]`,
        block, prefix, tokenVars, parentPrefix,
      );
    }
  }
  return css;
}

export function generateComponentPresets(
  names: GeneratorNames,
  presets: Record<string, ParsedPreset> | undefined,
  slots: Record<string, ParsedSlot> | undefined,
  tokenVars: Record<string, string>,
): string {
  if (!presets && !slots) return "";
  const { resolvedName, prefix, parentPrefix } = names;
  const base = buildSlotSelector(resolvedName);
  let css = "";

  // ── presets de nivel componente: [data-slot="X"][data-set="Y"] ────────────────────
  if (presets) {
    for (const [presetName, preset] of Object.entries(presets)) {
      css += emitPreset(`${base}[data-set="${presetName}"]`, preset, prefix, tokenVars, parentPrefix);
    }
  }

  // ── slots: [data-slot="X"][data-slots="Y"] ────────────────────────────────────────
  if (slots) {
    for (const [slotName, slot] of Object.entries(slots)) {
      const slotSelector = `${base}[data-slots="${slotName}"]`;
      css += emitBlock(slotSelector, slot, prefix, tokenVars, parentPrefix);

      if (slot.presets) {
        for (const [presetName, preset] of Object.entries(slot.presets)) {
          css += emitPreset(
            `${slotSelector}[data-set="${presetName}"]`,
            preset, prefix, tokenVars, parentPrefix,
          );
        }
      }
    }
  }

  return css;
}
