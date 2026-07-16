import { useEffect, useMemo, useState } from "react";
import { useLayoutContext, type LayoutContextValue } from "../context/LayoutContext";
import type { OrientationProp } from "../factory";
import type { GeneratorConfig } from "../theme/generators/css-gen-utils";
import type { Theme, Scales, ComponentVariants } from "../theme";

export type ResolvedLayout = {
  set?: string;
  size?: Scales;
  variant?: ComponentVariants;
  orientation?: OrientationProp;
};

function resolveBreakpointSize(theme: Theme, viewportW: number): Scales | undefined {
  const sorted = Object.entries(theme.breakpoints)
    .map(([name, val]) => ({ name: name as Scales, px: parseInt(val) }))
    .sort((a, b) => a.px - b.px);

  if (sorted.length === 0) return undefined;

  return (sorted.filter((bp) => viewportW >= bp.px).at(-1) ?? sorted[0]).name;
}

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

function resolveInheritedSet(
  layout: LayoutContextValue,
  componentConfig: GeneratorConfig | undefined,
  ownPresetNames: Set<string>,
): string | undefined {
  const isFromDeclaredParent =
    Boolean(componentConfig?.parentName) && layout.componentName === componentConfig?.parentName;
  if (!isFromDeclaredParent || layout.set == null) return undefined;
  return ownPresetNames.has(layout.set) ? layout.set : undefined;
}

export function useResolveLayout(
  own: LayoutContextValue,
  theme: Theme,
  componentConfig?: GeneratorConfig,
): ResolvedLayout {
  const [viewportW, setViewportW] = useState(() => window?.innerWidth ?? 0);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sizeResponsive = useMemo(() => resolveBreakpointSize(theme, viewportW), [theme, viewportW]);
  const layout = useLayoutContext();
  const ownPresetNames = useMemo(() => collectOwnPresetNames(componentConfig), [componentConfig]);

  return {
    set: own.set ?? resolveInheritedSet(layout, componentConfig, ownPresetNames),
    variant: own.variant,
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation,
  };
}
