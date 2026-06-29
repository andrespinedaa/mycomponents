import type { Theme } from "../theme.types";
import type { VariantTokens } from "../theme.variants";
import { camelToKebab } from "../../utils/string";
import { resolveVarName } from "./css-gen-utils";
import { resolveTokenValue } from "./generateVariants";
import { BREAKPOINT_KEYS } from "./system-css.types";

export function generateComponentSizes(
  componentName: string,
  config: NonNullable<Theme["components"]>[string],
  theme: Theme,
): string {
  if (!config?.sizes) return "";
  const prefix = config.prefix ?? camelToKebab(componentName);
  let css = "";

  for (const [sizeKey, tokens] of Object.entries(config.sizes)) {
    if (!tokens || Object.keys(tokens).length === 0) continue;

    // ─── Estático: [data-slot="X"][data-size="sm"] ────────────────────────
    const selector = `[data-slot="${componentName}"][data-size="${sizeKey}"]`;
    const tokenEntries = Object.entries(tokens as VariantTokens).filter(
      ([, v]) => v != null,
    );
    if (tokenEntries.length > 0) {
      css += `${selector}{`;
      for (const [key, value] of tokenEntries) {
        css += `${resolveVarName(key, prefix)}:${resolveTokenValue(
          key,
          String(value),
          theme,
        )};`;
      }
      css += "}";
    }

    // ─── Responsive: @media { [data-size-md="sm"] } ───────────────────────
    for (const bp of BREAKPOINT_KEYS) {
      if (bp === "base") continue;
      const bpValue = theme.breakpoints[bp];
      if (!bpValue) continue;
      const bpSelector = `[data-slot="${componentName}"][data-size-${bp}="${sizeKey}"]`;
      css += `@media(min-width:${bpValue}){${bpSelector}{`;
      for (const [key, value] of tokenEntries) {
        css += `${resolveVarName(key, prefix)}:${resolveTokenValue(
          key,
          String(value),
          theme,
        )};`;
      }
      css += "}}";
    }
  }

  return css;
}

export function generateSizes(theme: Theme): string {
  if (!theme.components) return "";
  return Object.entries(theme.components)
    .map(([name, config]) => generateComponentSizes(name, config, theme))
    .join("");
}
