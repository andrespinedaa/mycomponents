import type { ComponentStates } from "../../theme/theme.types";
import { type GeneratorConfig } from "./css-gen-utils";
import { DOLLAR_DSL } from "../system.data";
import { STATE_SELECTORS } from "../system.data";

// ── IR types ──────────────────────────────────────────────────────────────────

export type ParsedStateNode = {
  flat: Record<string, unknown>;
  nested: Array<[ComponentStates, Record<string, unknown>]>;
};

export type ParsedBlock = {
  flat: Record<string, unknown>;
  states: Array<[ComponentStates, ParsedStateNode]>;
};

export type ParsedPreset = ParsedBlock & {
  orientation?: Record<string, ParsedBlock>;
};

export type ParsedSlot = ParsedBlock & {
  presets?: Record<string, ParsedPreset>;
};

export type ParsedVariants = ParsedBlock & {
  entries: Array<[string, ParsedBlock]>;
};

export type ParsedOrientationEntry = {
  flat: Record<string, unknown>;
  sizeAware: Record<string, string>;
};

type ParsedComponentConfig = {
  usedKeys: Set<string>;
  variants?: ParsedVariants;
  sizes?: Record<string, Record<string, unknown>>;
  presets?: Record<string, ParsedPreset>;
  slots?: Record<string, ParsedSlot>;
  orientation?: Record<string, ParsedOrientationEntry>;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseStateNode(node: Record<string, unknown>): ParsedStateNode {
  const flat: Record<string, unknown> = {};
  const nested: Array<[ComponentStates, Record<string, unknown>]> = [];
  for (const [key, value] of Object.entries(node)) {
    if (value == null) continue;
    if (typeof value === "object" && isStateKey(key)) {
      const nestedFlat: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (typeof v !== "object") nestedFlat[k] = v;
      }
      nested.push([key as ComponentStates, nestedFlat]);
    } else {
      flat[key] = value;
    }
  }
  return { flat, nested };
}

function parseBlock(obj: Record<string, unknown>, skipKeys?: string[]): ParsedBlock {
  const flat: Record<string, unknown> = {};
  const states: Array<[ComponentStates, ParsedStateNode]> = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || skipKeys?.includes(key)) continue;
    if (typeof value !== "object") {
      flat[key] = value;
    } else if (isStateKey(key)) {
      states.push([key as ComponentStates, parseStateNode(value as Record<string, unknown>)]);
    }
  }
  return { flat, states };
}

function collectBlockKeys(block: ParsedBlock, usedKeys: Set<string>): void {
  for (const key of Object.keys(block.flat)) usedKeys.add(key);
  for (const [, node] of block.states) {
    for (const key of Object.keys(node.flat)) usedKeys.add(key);
    for (const [, nestedFlat] of node.nested) {
      for (const key of Object.keys(nestedFlat)) usedKeys.add(key);
    }
  }
}

function parsePreset(tokens: Record<string, unknown>): ParsedPreset {
  const block = parseBlock(tokens, ["orientation"]);
  const raw = tokens["orientation"] as Record<string, Record<string, unknown>> | undefined;
  if (!raw) return block;
  const orientation: Record<string, ParsedBlock> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v && typeof v === "object") orientation[k] = parseBlock(v as Record<string, unknown>);
  }
  return { ...block, orientation };
}

function parseSlot(slotObj: Record<string, unknown>): ParsedSlot {
  const block = parseBlock(slotObj, ["presets"]);
  const raw = slotObj["presets"] as Record<string, unknown> | undefined;
  if (!raw) return block;
  const presets: Record<string, ParsedPreset> = {};
  for (const [name, v] of Object.entries(raw)) {
    if (v && typeof v === "object") presets[name] = parsePreset(v as Record<string, unknown>);
  }
  return { ...block, presets };
}

function isStateKey(key: string): key is ComponentStates {
  return key in STATE_SELECTORS;
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseComponentConfig(config: GeneratorConfig): ParsedComponentConfig {
  const usedKeys = new Set<string>();
  const result: ParsedComponentConfig = { usedKeys };

  // ── variants ─────────────────────────────────────────────────────────────────
  if (config.variants) {
    const flat: Record<string, unknown> = {};
    const states: Array<[ComponentStates, ParsedStateNode]> = [];
    const entries: Array<[string, ParsedBlock]> = [];

    for (const [key, value] of Object.entries(config.variants as Record<string, unknown>)) {
      if (value == null) continue;
      if (typeof value !== "object") {
        flat[key] = value;
      } else if (isStateKey(key)) {
        states.push([key as ComponentStates, parseStateNode(value as Record<string, unknown>)]);
      } else {
        const block = parseBlock(value as Record<string, unknown>);
        entries.push([key, block]);
        collectBlockKeys(block, usedKeys);
      }
    }
    const variants: ParsedVariants = { flat, states, entries };
    collectBlockKeys({ flat, states }, usedKeys);
    result.variants = variants;
  }

  // ── sizes ─────────────────────────────────────────────────────────────────────
  if (config.sizes) {
    result.sizes = {};
    for (const [sizeKey, tokens] of Object.entries(config.sizes)) {
      if (!tokens) continue;
      result.sizes[sizeKey] = tokens as Record<string, unknown>;
      for (const key of Object.keys(tokens)) usedKeys.add(key);
    }
  }

  // ── presets ───────────────────────────────────────────────────────────────────
  if (config.presets) {
    result.presets = {};
    for (const [name, tokens] of Object.entries(config.presets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const preset = parsePreset(tokens as Record<string, unknown>);
      collectBlockKeys(preset, usedKeys);
      if (preset.orientation) {
        for (const block of Object.values(preset.orientation)) collectBlockKeys(block, usedKeys);
      }
      result.presets[name] = preset;
    }
  }

  // ── slots ─────────────────────────────────────────────────────────────────────
  if (config.slots) {
    result.slots = {};
    for (const [name, slotVal] of Object.entries(config.slots)) {
      if (!slotVal || typeof slotVal !== "object") continue;
      const slot = parseSlot(slotVal as Record<string, unknown>);
      collectBlockKeys(slot, usedKeys);
      if (slot.presets) {
        for (const preset of Object.values(slot.presets)) {
          collectBlockKeys(preset, usedKeys);
          if (preset.orientation) {
            for (const block of Object.values(preset.orientation))
              collectBlockKeys(block, usedKeys);
          }
        }
      }
      result.slots[name] = slot;
    }
  }

  // ── orientation ───────────────────────────────────────────────────────────────
  if (config.orientation) {
    result.orientation = {};
    const hasSizes = !!config.sizes;
    for (const [key, tokens] of Object.entries(config.orientation)) {
      if (!tokens || typeof tokens !== "object") continue;
      const flat: Record<string, unknown> = {};
      const sizeAware: Record<string, string> = {};
      for (const [k, v] of Object.entries(tokens as Record<string, unknown>)) {
        if (v == null) continue;
        DOLLAR_DSL.lastIndex = 0;
        if (typeof v === "string" && hasSizes && DOLLAR_DSL.test(v)) {
          sizeAware[k] = v;
        } else {
          flat[k] = v;
        }
      }
      for (const k of Object.keys(flat)) usedKeys.add(k);
      for (const k of Object.keys(sizeAware)) usedKeys.add(k);
      result.orientation[key] = { flat, sizeAware };
    }
  }

  return result;
}
