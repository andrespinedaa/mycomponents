import { useEffect, useMemo, useState } from "react";
import { useLayoutContext, type LayoutContextValue } from "../context/LayoutContext";
import type { OrientationProp } from "../factory";
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

export function useResolveLayout(own: LayoutContextValue, theme: Theme): ResolvedLayout {
  const [viewportW, setViewportW] = useState(() => window?.innerWidth ?? 0);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sizeResponsive = useMemo(() => resolveBreakpointSize(theme, viewportW), [theme, viewportW]);
  const layout = useLayoutContext();

  // set/variant NO heredan del contexto — son selectores de estilo propios del componente, no
  // "ambiente" compartido. Un componente anidado por casualidad (ej. Badge dentro de Card) no debe
  // heredar el variant/set de un ancestro con un vocabulario de estilos completamente distinto.
  // size/orientation sí son ambientales (viewport, dirección de layout) y se propagan a propósito.
  return {
    set: own.set,
    variant: own.variant,
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation
  };
}
