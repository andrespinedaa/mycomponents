import type { Theme } from "../theme.types";
import { generateComponentBases } from "./generateBases";
import { generateComponentVariants } from "./generateVariants";
import { generateComponentSizes } from "./generateSizes";

function generateComponent(
  name: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  return (
    generateComponentBases(name, config) +
    generateComponentVariants(name, config, theme) +
    generateComponentSizes(name, config, theme)
  );
}

export function generateComponents(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponent(name, config, theme))
    .join("");
}
