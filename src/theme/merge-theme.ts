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

// Deep-merges two VariantsField objects: flat tokens and variant/state sub-objects each merged one level.
function mergeVariants(
  base: Record<string, unknown> | undefined,
  override: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!override) return base;
  if (!base) return override;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value != null && typeof value === "object" && typeof base[key] === "object" && base[key] != null) {
      result[key] = { ...(base[key] as object), ...(value as object) };
    } else {
      result[key] = value;
    }
  }
  return result;
}

function mergeSlotEntry(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (key === "presets" && value != null && typeof value === "object" && typeof base[key] === "object" && base[key] != null) {
      result[key] = { ...(base[key] as object), ...(value as object) };
    } else if (value != null && typeof value === "object" && typeof base[key] === "object" && base[key] != null) {
      result[key] = { ...(base[key] as object), ...(value as object) };
    } else {
      result[key] = value;
    }
  }
  return result;
}

function mergeSlots(
  base: Record<string, unknown> | undefined,
  override: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!override) return base;
  if (!base) return override;

  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (key === "slots") {
      const baseSlots = (base["slots"] ?? {}) as Record<string, unknown>;
      const overrideSlots = value as Record<string, unknown>;
      const mergedSlots: Record<string, unknown> = { ...baseSlots };
      for (const [slotName, slotOverride] of Object.entries(overrideSlots)) {
        const baseSlot = (baseSlots[slotName] ?? {}) as Record<string, unknown>;
        mergedSlots[slotName] = mergeSlotEntry(baseSlot, slotOverride as Record<string, unknown>);
      }
      result["slots"] = mergedSlots;
    } else if (value != null && typeof value === "object" && typeof base[key] === "object" && base[key] != null) {
      result[key] = { ...(base[key] as object), ...(value as object) };
    } else {
      result[key] = value;
    }
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
      variants:     mergeVariants(baseEntry?.variants, overrideEntry.variants),
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
