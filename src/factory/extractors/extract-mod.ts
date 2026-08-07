import type { ModProp } from "..";

type ModProps = Record<`data-${string}`, string | boolean>;
type ModEntry = boolean | null | undefined | ModProp;
type ModInput = ModEntry | (ModEntry | ModEntry[])[];

function processEntry(entry: ModEntry, result: ModProps, smallestBreakpoint: string): void {
  if (!entry || typeof entry === "boolean") return;

  if (typeof entry === "string") {
    result[`data-${entry}`] = true;
    return;
  }

  for (const [k, v] of Object.entries(entry)) {
    if (v === false || v === null || v === undefined) continue;

    if (typeof v === "object") {
      for (const [bp, bpVal] of Object.entries(v)) {
        if (!bpVal) continue;
        (result as Record<string, string>)[
          bp === smallestBreakpoint ? `data-${k}` : `data-${k}-${bp}`
        ] = bpVal as string;
      }
    } else {
      (result as Record<string, string | boolean>)[`data-${k}`] = v as string | boolean;
    }
  }
}

export function extractMod(mod: ModInput | undefined, smallestBreakpoint: string): ModProps {
  const result: ModProps = {};
  const entries = Array.isArray(mod) ? mod.flat() : [mod];
  for (const entry of entries) processEntry(entry, result, smallestBreakpoint);
  return result;
}
