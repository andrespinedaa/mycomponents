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
  tokenVars: Record<string, string>,
): string {
  return (
    generateComponentBases(name, config) +
    generateComponentVariants(name, config, tokenVars) +
    generateComponentSizes(name, config, theme, tokenVars) +
    generateComponentPresets(name, config, tokenVars) +
    generateComponentOrientation(name, config, tokenVars)
  );
}

export function generateComponents(theme: Theme, tokenVars: Record<string, string>): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponent(name, config, theme, tokenVars))
    .join("");
}
