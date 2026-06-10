// src/theme/merge-theme.ts
import type { ColorScale, Theme, ThemeColors, ThemeOverride } from "./types";

// ─── Mergers para colors ──────────────────────────────────────────────────────

function mergeColors(
  base: ThemeColors,
  override: ThemeOverride["colors"],
): ThemeColors {
  if (!override) return base;

  return Object.keys(override).reduce(
    (acc, key) => {
      const overrideScale = override[key as keyof typeof override];
      if (!overrideScale) return acc;

      const baseScale = acc[key as keyof ThemeColors] as ColorScale | undefined;

      return {
        ...acc,
        [key]: baseScale ? { ...baseScale, ...overrideScale } : overrideScale,
      };
    },
    { ...base } as ThemeColors,
  );
}

// ─── Mergers por sección ──────────────────────────────────────────────────────

function mergeRecord<T extends Record<string, string>>(
  base: T,
  override: Partial<T> | undefined,
): T {
  if (!override) return base;
  return { ...base, ...override } as T;
}

// ─── merge principal ──────────────────────────────────────────────────────────

export function mergeTheme(base: Theme, override: ThemeOverride = {}): Theme {
  return {
    cssVarPrefix: override.cssVarPrefix ?? base.cssVarPrefix,
    colors: mergeColors(base.colors, override.colors),
    spacing: mergeRecord(base.spacing, override.spacing),
    radii: mergeRecord(base.radii, override.radii),
    fontSizes: mergeRecord(base.fontSizes, override.fontSizes),
    breakpoints: mergeRecord(base.breakpoints, override.breakpoints),
  };
}
