export type ModProps = Record<`data-${string}`, string | boolean>;
export type ModEntry = string | boolean | null | undefined | Record<string, unknown>;
export type ModInput = ModEntry | ModEntry[];

function processEntry(entry: ModEntry, result: ModProps): void {
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
          bp === "base" ? `data-${k}` : `data-${k}-${bp}`
        ] = bpVal as string;
      }
    } else {
      (result as Record<string, string | boolean>)[`data-${k}`] = v as string | boolean;
    }
  }
}

export function getMod(mod?: ModInput): ModProps {
  const result: ModProps = {};
  const entries = Array.isArray(mod) ? mod.flat() : [mod];
  for (const entry of entries) processEntry(entry, result);
  return result;
}
