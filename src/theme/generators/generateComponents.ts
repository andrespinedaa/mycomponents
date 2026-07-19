import type { Theme } from "../core/theme.types";
import type { GeneratorConfig } from "./css-gen-utils";
import { generateComponentBases } from "./generateBases";
import { generateComponentOrientation } from "./generateOrientation";
import { generateComponentPresets } from "./generatePresets";
import { generateComponentVariants } from "./generateVariants";
import { generateComponentSizes } from "./generateSizes";

function generateComponent(
  name: string,
  config: GeneratorConfig,
  theme: Theme,
): string {
  let css =
    generateComponentBases(name, config) +
    generateComponentVariants(name, config, theme) +
    generateComponentSizes(name, config, theme) +
    generateComponentPresets(name, config, theme) +
    generateComponentOrientation(name, config, theme);

  if (config?.statics) {
    for (const [slotKey, slotConfig] of Object.entries(config.statics)) {
      if (!slotConfig) continue;
      css += generateComponent(slotKey, slotConfig as GeneratorConfig, theme);
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
