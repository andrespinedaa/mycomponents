import { useMemo } from "react";
import { useLayoutContext, type LayoutContextValue } from "../../context/LayoutContext";
import type { OrientationProp } from "..";
import { type ComponentVariants, type Scales } from "../../theme";
import type { GeneratorConfig } from "../../system/generators/css-gen-utils";

type LayoutRelevantConfig = Pick<GeneratorConfig, "presets" | "slots" | "parentName">;

type ResolvedLayout = {
  set?: string;
  size?: Scales;
  variant?: ComponentVariants;
  orientation?: OrientationProp;
};

function collectOwnPresetNames(config: LayoutRelevantConfig | undefined): Set<string> {
  const names = new Set<string>();
  if (config?.presets) {
    for (const key of Object.keys(config.presets)) names.add(key);
  }
  if (config?.slots) {
    for (const slot of Object.values(
      config.slots as Record<string, { presets?: Record<string, unknown> }>,
    )) {
      if (slot?.presets) for (const key of Object.keys(slot.presets)) names.add(key);
    }
  }
  return names;
}

function isChild(
  layout: LayoutContextValue,
  config: LayoutRelevantConfig | undefined,
): boolean {
  return (
    Boolean(config?.parentName) && layout.name === config?.parentName
  );
}

function resolveInheritedSet(
  layout: LayoutContextValue,
  config: LayoutRelevantConfig | undefined,
  ownPresetNames: Set<string>,
): string | undefined {
  if (!isChild(layout, config) || layout.set == null) return undefined;
  return ownPresetNames.has(layout.set) ? layout.set : undefined;
}

function resolveInheritedVariant(
  layout: LayoutContextValue,
  config: LayoutRelevantConfig | undefined,
): ComponentVariants | undefined {
  return isChild(layout, config) ? layout.variant : undefined;
}

export function resolveLayout(
  sizeResponsive: Scales,
  own: LayoutContextValue,
  config?: LayoutRelevantConfig,
): ResolvedLayout {
  const ownPresetNames = useMemo(() => collectOwnPresetNames(config), [config]);
  const layout = useLayoutContext();

  return {
    set: own.set ?? resolveInheritedSet(layout, config, ownPresetNames),
    variant: own.variant ?? resolveInheritedVariant(layout, config),
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation,
  };
}
