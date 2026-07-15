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

  // Viewport menor al breakpoint más chico → floor al más chico, nunca undefined
  return (sorted.filter((bp) => viewportW >= bp.px).at(-1) ?? sorted[0]).name;
}

// Nombres de preset propios de este componente — de su `presets` de nivel raíz y de los
// `presets` de TODOS sus slots (sin importar cuál `section` esté activa ahora mismo). Usado
// para el gate por nombre de la cascada de `set` — ver resolveInheritedSet.
function collectOwnPresetNames(config: GeneratorConfig | undefined): Set<string> {
  const names = new Set<string>();
  if (config?.presets) {
    for (const key of Object.keys(config.presets)) names.add(key);
  }
  const slots = (
    config?.sections as { slots?: Record<string, { presets?: Record<string, unknown> }> } | undefined
  )?.slots;
  if (slots) {
    for (const slot of Object.values(slots)) {
      if (slot?.presets) for (const key of Object.keys(slot.presets)) names.add(key);
    }
  }
  return names;
}

// `set` hereda del contexto SOLO si se cumplen dos condiciones a la vez:
// 1. Family — quien proveyó el layer de contexto activo es el padre que este componente declaró
//    (`componentConfig.parentName`). Nunca un ancestro cualquiera — así Badge, que no declara
//    parentName, nunca puede heredar nada sin importar dónde se anide.
// 2. Nombre — este componente (o alguno de sus slots) también declara un preset con ese mismo
//    nombre. Así "background" en Card solo llega a CardSection si CardSection TAMBIÉN tiene un
//    preset "background" — nunca por coincidencia accidental de string.
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

  // variant NO hereda del contexto — es un selector de estilo propio del componente, no "ambiente"
  // compartido, y a diferencia de `set` no tiene un mecanismo de gate por nombre (todavía).
  // size/orientation sí son ambientales (viewport, dirección de layout) y se propagan siempre.
  // set hereda solo bajo el gate de compound component — ver resolveInheritedSet.
  return {
    set: own.set ?? resolveInheritedSet(layout, componentConfig, ownPresetNames),
    variant: own.variant,
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation,
  };
}
