import type { Theme } from "./types";

// Genera el string CSS que va en el <style>
export function resolveThemeToCss(theme: Theme, selector = ":root"): string {
  const p = theme.cssVarPrefix;
  const vars: string[] = [];

  // Colores
  for (const [colorName, scale] of Object.entries(theme.colors)) {
    for (const [stop, value] of Object.entries(scale)) {
      vars.push(`--${p}-color-${colorName}-${stop}: ${value};`);
    }
  }

  // Spacing
  for (const [key, value] of Object.entries(theme.spacing)) {
    vars.push(`--${p}-spacing-${key}: ${value};`);
  }

  // Radii
  for (const [key, value] of Object.entries(theme.radii)) {
    vars.push(`--${p}-radius-${key}: ${value};`);
  }

  // Font sizes
  for (const [key, value] of Object.entries(theme.fontSizes)) {
    vars.push(`--${p}-font-size-${key}: ${value};`);
  }

  return `${selector} {\n  ${vars.join("\n  ")}\n}`;
}

// Helper tipado para usar vars en JS (inline styles o lógica)
export function cssVar(prefix: string, path: string): string {
  return `var(--${prefix}-${path})`;
}