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
  return Object.entries(theme.breakpoints)
    .map(([name, val]) => ({ name: name as Scales, px: parseInt(val) }))
    .sort((a, b) => a.px - b.px)
    .filter((bp) => viewportW >= bp.px)
    .at(-1)?.name;
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

  return {
    set: own.set ?? layout.set,
    variant: own.variant ?? layout.variant,
    size: own.size ?? layout.size ?? sizeResponsive,
    orientation: own.orientation ?? layout.orientation
  };
}
