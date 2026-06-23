import type { Theme } from "../theme.types";

export function generateTokens(theme: Theme): string {
  const { cssVarPrefix: p, colors, spacing, radii, fontSizes, dark } = theme;

  let css = ":root{";

  for (const [name, scale] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(scale)) {
      css += `--${p}-color-${name}-${shade}:${value};`;
    }
  }
  for (const [key, value] of Object.entries(spacing)) {
    css += `--${p}-spacing-${key}:${value};`;
  }
  for (const [key, value] of Object.entries(radii)) {
    css += `--${p}-radius-${key}:${value};`;
  }
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `--${p}-font-size-${key}:${value};`;
  }

  css += "}";

  if (dark?.colors) {
    css += "[data-color-scheme=dark]{";
    for (const [name, scale] of Object.entries(dark.colors)) {
      if (!scale) continue;
      for (const [shade, value] of Object.entries(scale)) {
        css += `--${p}-color-${name}-${shade}:${value};`;
      }
    }
    css += "}";
  }

  return css;
}
