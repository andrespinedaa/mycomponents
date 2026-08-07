import type { Theme, VarsCss } from "../../theme/theme.types";
import { type GeneratorConfig } from "./css-gen-utils";
import { parseComponentConfig } from "./parseComponentConfig";
import { generateBases } from "./generateBases";
import { generateOrientation } from "./generateOrientation";
import { generatePresets } from "./generatePresets";
import { generateVariants } from "./generateVariants";
import { generateSizes } from "./generateSizes";
import { camelToKebab } from "../../utils/string";

export type GeneratorNames = {
  selector: string;
  prefix: string;
  parentPrefix?: string;
};

export function generateNames(name: string, config: GeneratorConfig): GeneratorNames {
  return {
    prefix: camelToKebab(config?.name ?? name),
    selector: `[data-slot="${config?.name ?? name}"]`,
    parentPrefix: config?.parentName ? camelToKebab(config.parentName) : undefined,
  };
}

function generateComponent(
  name: string,
  config: GeneratorConfig,
  theme: Theme,
  tokenVars: VarsCss,
): string {
  const names = generateNames(name, config);
  const parsed = parseComponentConfig(config);
  return (
    generateBases(names, parsed.usedKeys) +
    generateVariants(names, parsed.variants, tokenVars) +
    generateSizes(names, parsed.sizes, theme, tokenVars) +
    generatePresets(names, parsed.presets, parsed.slots, tokenVars) +
    generateOrientation(names, parsed.orientation, parsed.sizes, tokenVars)
  );
}

export function generateComponents(theme: Theme, tokenVars: VarsCss): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponent(name, config, theme, tokenVars))
    .join("");
}
