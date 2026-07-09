import { camelToKebab } from "../../utils/string";
import type { Theme } from "../core/theme.types";
import { generateTokensCSS } from "./css-gen-utils";

function prefixToPascal(prefix: string): string {
  return prefix.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

function deriveSectionAttr(componentName: string, prefixParent: string | undefined): string {
  if (!prefixParent) return "section";
  const parentName = prefixToPascal(prefixParent);
  if (componentName.startsWith(parentName)) {
    return componentName.slice(parentName.length).toLowerCase();
  }
  return "section";
}

export function generateComponentPresets(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.presets) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  const sectionAttr = deriveSectionAttr(componentName, config.prefixParent);

  let css = "";
  for (const [sectionValue, setPresets] of Object.entries(config.presets)) {
    if (!setPresets) continue;
    for (const [setName, tokens] of Object.entries(setPresets)) {
      if (!tokens || Object.keys(tokens).length === 0) continue;
      const body = generateTokensCSS(tokens as Record<string, unknown>, prefix, theme, config.prefixParent);
      if (!body) continue;
      // "default" aplica siempre al section (sin [data-set]), named presets se apilan encima
      const setQualifier = setName === "default" ? "" : `[data-set="${setName}"]`;
      const selector = `[data-slot="${componentName}"][data-${sectionAttr}="${sectionValue}"]${setQualifier}`;
      css += `${selector}{${body}}`;
    }
  }

  return css;
}

export function generatePresets(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponentPresets(name, config, theme))
    .join("");
}
