import type {
  ColorScale,
  Theme,
  ThemeColors,
  ThemeOverride,
} from "./core/theme.types";

export function mergeColors(
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

export function mergeRecord<T extends Record<string, string>>(
  base: T,
  override: Partial<T> | undefined,
): T {
  if (!override) return base;
  return { ...base, ...override } as T;
}

function mergeSlots(
  base: Record<string, { presets?: Record<string, unknown> }> | undefined,
  override: Record<string, { presets?: Record<string, unknown> }> | undefined,
): Record<string, { presets?: Record<string, unknown> }> {
  if (!override) return base ?? {};
  const result = { ...base };
  for (const [slot, slotConfig] of Object.entries(override)) {
    result[slot] = {
      ...(base?.[slot] ?? {}),
      presets: { ...(base?.[slot]?.presets ?? {}), ...(slotConfig?.presets ?? {}) },
    };
  }
  return result;
}

export function mergeComponents(
  base: Theme["components"],
  override: ThemeOverride["components"],
): Theme["components"] {
  if (!override) return base;
  const result = { ...base } as Theme["components"];

  for (const key of Object.keys(override) as (keyof typeof override)[]) {
    const overrideEntry = override[key];
    if (!overrideEntry) continue;

    const baseEntry = (result as any)[key];
    (result as any)[key] = {
      ...baseEntry,
      ...overrideEntry,
      defaultProps: { ...(baseEntry?.defaultProps ?? {}), ...(overrideEntry.defaultProps ?? {}) },
      variants:     { ...(baseEntry?.variants ?? {}),     ...(overrideEntry.variants ?? {}) },
      sizes:        { ...(baseEntry?.sizes ?? {}),         ...(overrideEntry.sizes ?? {}) },
      presets:      { ...(baseEntry?.presets ?? {}),       ...(overrideEntry.presets ?? {}) },
      slots: mergeSlots(baseEntry?.slots, overrideEntry.slots),
    };
  }

  return result;
}

export function mergeTheme(base: Theme, override: ThemeOverride): Theme {
  return {
    ...base,

    cssVarPrefix: override.cssVarPrefix ?? base.cssVarPrefix,

    colors: mergeColors(base.colors, override.colors),

    spacing: mergeRecord(base.spacing, override.spacing),

    radii: mergeRecord(base.radii, override.radii),

    fontSizes: mergeRecord(base.fontSizes, override.fontSizes),

    breakpoints: mergeRecord(base.breakpoints, override.breakpoints),

    macros: { ...base.macros, ...override.macros },

    components: mergeComponents(base.components, override.components),

    dark: override.dark ?? base.dark,
  };
}
