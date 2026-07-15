import type { Theme } from "../core/theme.types";
import { generateComponentBases } from "./generateBases";
import { generateComponentPresets } from "./generatePresets";
import { generateComponentVariants } from "./generateVariants";
import { generateComponentSizes } from "./generateSizes";

function generateComponent(
  name: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  let css =
    generateComponentBases(name, config) +
    generateComponentVariants(name, config, theme) +
    generateComponentSizes(name, config, theme) +
    generateComponentPresets(name, config, theme);

  if (config?.statics) {
    for (const [slotKey, slotConfig] of Object.entries(config.statics)) {
      if (!slotConfig) continue;
      const canonicalEntry = Object.entries(theme.components ?? {}).find(([, cfg]) => cfg === slotConfig);
      const canonicalName = canonicalEntry?.[0] ?? slotKey;
      css += generateComponent(canonicalName, slotConfig as NonNullable<Theme["components"]>[string], theme);
    }
  }

  return css;
}

export function generateComponents(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .filter(([, config]) => !config?.parentName) // statics are generated via parent recursion
    .map(([name, config]) => generateComponent(name, config, theme))
    .join("");
}
