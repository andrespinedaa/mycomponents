import { camelToKebab } from "../../utils/string";
import type { Theme } from "../core/theme.types";

function resolveSemanticRef(value: string, prefix: string): string {
  const match = value.match(/^([a-z]+)\.(\d+)$/);
  if (match) return `var(--${prefix}-color-${match[1]}-${match[2]})`;
  return value;
}

export function generateTokens(theme: Theme): string {
  const {
    cssVarPrefix: prefix,
    colors,
    spacing,
    radii,
    fontSizes,
    typography,
    shadows,
    motion,
    semantic,
    dark,
  } = theme;

  let css = ":root{";

  // ─── Colors ───────────────────────────────────────────────────────────────
  css += `--${prefix}-color-neutral-0:#ffffff;`;

  for (const [name, scale] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(scale)) {
      css += `--${prefix}-color-${name}-${shade}:${value};`;
    }
  }

  // ─── Spacing ──────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(spacing)) {
    css += `--${prefix}-spacing-${key}:${value};`;
  }

  // ─── Radii ────────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(radii)) {
    css += `--${prefix}-radius-${key}:${value};`;
  }

  // ─── Font sizes ───────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(fontSizes)) {
    css += `--${prefix}-font-size-${key}:${value};`;
  }

  // ─── Typography ───────────────────────────────────────────────────────────
  css += `--${prefix}-font-sans:${typography.fontSans};`;
  css += `--${prefix}-font-mono:${typography.fontMono};`;
  css += `--${prefix}-tracking-tight:${typography.trackingTight};`;
  css += `--${prefix}-weight-heading:${typography.weightHeading};`;

  // ─── Shadows ─────────────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(shadows)) {
    css += `--${prefix}-shadow-${key}:${value};`;
  }

  // ─── Motion ───────────────────────────────────────────────────────────────
  css += `--${prefix}-ease-default:${motion.easeDefault};`;
  css += `--${prefix}-ease-in:${motion.easeIn};`;
  css += `--${prefix}-dur-fast:${motion.durFast};`;
  css += `--${prefix}-dur-state:${motion.durState};`;
  css += `--${prefix}-dur-layout:${motion.durLayout};`;

  // ─── Semantic — dark default ──────────────────────────────────────────────
  if (semantic?.dark) {
    for (const [key, value] of Object.entries(semantic.dark)) {
      if (!value) continue;
      const kebab = camelToKebab(key);
      css += `--${prefix}-color-${kebab}:${resolveSemanticRef(value, prefix)};`;
    }
  }

  css += "}";

  // ─── Dark mode override (color scale) ─────────────────────────────────────
  if (dark?.colors || dark?.shadows || dark?.semantic) {
    css += "[data-color-scheme=dark]{";

    if (dark.colors) {
      for (const [name, scale] of Object.entries(dark.colors)) {
        if (!scale) continue;
        for (const [shade, value] of Object.entries(scale)) {
          css += `--${prefix}-color-${name}-${shade}:${value};`;
        }
      }
    }

    if (dark.shadows) {
      for (const [key, value] of Object.entries(dark.shadows)) {
        if (!value) continue;
        css += `--${prefix}-shadow-${key}:${value};`;
      }
    }

    if (dark.semantic) {
      for (const [key, value] of Object.entries(dark.semantic)) {
        if (!value) continue;
        const kebab = camelToKebab(key);
        css += `--${prefix}-color-${kebab}:${resolveSemanticRef(value, prefix)};`;
      }
    }

    css += "}";
  }

  // ─── Light mode override (semantic layer) ─────────────────────────────────
  if (semantic?.light) {
    css += "[data-color-scheme=light]{";
    for (const [key, value] of Object.entries(semantic.light)) {
      if (!value) continue;
      const kebab = camelToKebab(key);
      css += `--${prefix}-color-${kebab}:${resolveSemanticRef(value, prefix)};`;
    }
    css += "}";
  }

  return css;
}
