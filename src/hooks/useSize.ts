import { useMemo, useEffect, useState } from "react";
import { useLayoutContext } from "../context/LayoutContext";
import type { Scales, Theme } from "../theme";
import { useTheme } from "./useTheme";
function resolveBreakpointSize(theme: Theme, viewportW: number): Scales | undefined {
  return Object.entries(theme.breakpoints)
    .map(([name, val]) => ({ name: name as Scales, px: parseInt(val) }))
    .sort((a, b) => a.px - b.px)
    .filter((bp) => viewportW >= bp.px)
    .at(-1)?.name;
}

export function useSize(_size?: Scales) {
  const { theme } = useTheme();
  const { size: sizeContext } = useLayoutContext();
  const [viewportW, setViewportW] = useState(() => window?.innerWidth ?? 0);

  useEffect(() => {
    const update = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const sizeResponsive = useMemo(() => resolveBreakpointSize(theme, viewportW), [theme, viewportW]);
  const size = _size ?? sizeContext ?? sizeResponsive;
  return { size };
}
