import type { Mod } from "../factory/factories.types";
import type { ComponentVariants } from "../theme/theme.variants";

export type ModProps = Record<`data-${string}`, string | boolean>;

export function getMod(
  mod?: Mod | Mod[],
  variant?: ComponentVariants,
): ModProps {
  const mods: Mod[] = [
    ...(mod ? (Array.isArray(mod) ? mod.flat() : [mod]) : []),
    ...(variant ? [{ variant }] : []),
  ];

  if (mods.length === 0) return {};

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
