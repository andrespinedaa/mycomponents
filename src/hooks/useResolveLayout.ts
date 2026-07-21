import { useMemo } from "react";
import { useLayoutContext, type LayoutContextValue } from "../context/LayoutContext";
import type { OrientationProp } from "../factory";
import { type ComponentVariants, type Scales } from "../theme";
import type { GeneratorConfig } from "../theme/generators/css-gen-utils";

export type ResolvedLayout = {
  set?: string;
  size?: Scales;
  variant?: ComponentVariants;
  orientation?: OrientationProp;
};

function collectOwnPresetNames(config: GeneratorConfig | undefined): Set<string> {
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
  componentConfig: GeneratorConfig | undefined,
): boolean {
  return (
    Boolean(componentConfig?.parentName) && layout.componentName === componentConfig?.parentName
  );
}

function resolveInheritedSet(
  layout: LayoutContextValue,
  componentConfig: GeneratorConfig | undefined,
  ownPresetNames: Set<string>,
): string | undefined {
  if (!isChild(layout, componentConfig) || layout.set == null) return undefined;
  return ownPresetNames.has(layout.set) ? layout.set : undefined;
}

function resolveInheritedVariant(
  layout: LayoutContextValue,
  componentConfig: GeneratorConfig | undefined,
): ComponentVariants | undefined {
  return isChild(layout, componentConfig) ? layout.variant : undefined;
}

export function useResolveLayout(
  sizeResponsive: Scales,
  own: LayoutContextValue,
  componentConfig?: GeneratorConfig,
): ResolvedLayout {
  const ownPresetNames = useMemo(() => collectOwnPresetNames(componentConfig), [componentConfig]);
  const layout = useLayoutContext();

  return {
    set: own.set ?? resolveInheritedSet(layout, componentConfig, ownPresetNames),
    variant: own.variant ?? resolveInheritedVariant(layout, componentConfig),
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation,
  };
}
