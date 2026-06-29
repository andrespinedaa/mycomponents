import { useInsertionEffect } from "react";
import { generateComponentBases } from "../theme/generators/generateBases";
import { generateComponentVariants } from "../theme/generators/generateVariants";
import { generateComponentSizes } from "../theme/generators/generateSizes";
import { registerComponentCSS } from "../system/css-registry";
import type { Theme } from "../theme/theme.types";

export function useComponentCSS(
  componentName: string | undefined,
  theme: Theme,
): void {
  useInsertionEffect(() => {
    if (!componentName || typeof document === "undefined") return;
    const config = theme.components?.[componentName];
    if (!config) return;
    registerComponentCSS(
      componentName,
      generateComponentBases(componentName, config, theme),
      generateComponentVariants(componentName, config, theme),
      generateComponentSizes(componentName, config, theme),
    );
  }, [componentName, theme]);
}
