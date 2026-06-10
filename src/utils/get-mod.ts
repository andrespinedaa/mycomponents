// utils/get-mod.ts
import type { ModProps } from "../factory/factory.types";

type Mod = Record<string, unknown> | string;

export function getMod(mod: Mod | Mod[] | undefined): ModProps {
  if (!mod) return {};

  const mods = (Array.isArray(mod) ? mod.flat() : [mod]) as Mod[];

  return mods.reduce<ModProps>((acc, m) => {
    if (typeof m === "string") {
      (acc as Record<string, unknown>)[`data-${m}`] = true;
    } else {
      for (const [k, v] of Object.entries(m)) {
        if (v !== false && v !== null && v !== undefined) {
          (acc as Record<string, unknown>)[`data-${k}`] = v;
        }
      }
    }
    return acc;
  }, {});
}