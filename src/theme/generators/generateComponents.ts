import type { Theme, VarsCss } from "../core/theme.types";
import { resolveGeneratorNames, type GeneratorConfig } from "./css-gen-utils";
import { parseComponentConfig } from "./parseComponentConfig";
import { generateComponentBases } from "./generateBases";
import { generateComponentOrientation } from "./generateOrientation";
import { generateComponentPresets } from "./generatePresets";
import { generateComponentVariants } from "./generateVariants";
import { generateComponentSizes } from "./generateSizes";

function generateComponent(
  name: string,
  config: GeneratorConfig,
  theme: Theme,
  tokenVars: VarsCss,
): string {
  const names = resolveGeneratorNames(name, config);
  const parsed = parseComponentConfig(config);
  return (
    generateComponentBases(names, parsed.usedKeys) +
    generateComponentVariants(names, parsed.variants, tokenVars) +
    generateComponentSizes(names, parsed.sizes, theme, tokenVars) +
    generateComponentPresets(names, parsed.presets, parsed.slots, tokenVars) +
    generateComponentOrientation(names, parsed.orientation, parsed.sizes, tokenVars)
  );
}

export function generateComponents(theme: Theme, tokenVars: VarsCss): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponent(name, config, theme, tokenVars))
    .join("");
}
