import { useEffect, useState } from "react";
import type { Scales, Theme } from "../theme/core/theme.types";

function resolveBreakpointSize(theme: Theme): Scales {
  const sorted = Object.entries(theme.breakpoints).sort(
    ([, a], [, b]) => parseInt(a) - parseInt(b),
  );
  let result = sorted[0]![0] as Scales;
  for (const [name, val] of sorted) {
    if (window.matchMedia(`(min-width: ${val})`).matches) result = name as Scales;
  }
  return result;
}

export function useBreakpointSize(theme: Theme): Scales {
  const [size, setSize] = useState<Scales>(() =>
    typeof window === "undefined"
      ? (Object.keys(theme.breakpoints)[0] as Scales)
      : resolveBreakpointSize(theme),
  );

  useEffect(() => {
    const update = () => setSize(resolveBreakpointSize(theme));
    update();
    const sorted = Object.entries(theme.breakpoints).sort(
      ([, a], [, b]) => parseInt(a) - parseInt(b),
    );
    // matchMedia: fires on DevTools preset button clicks + boundary crossings
    const mqls = sorted.map(([, val]) => window.matchMedia(`(min-width: ${val})`));
    mqls.forEach((mql) => mql.addEventListener("change", update));
    // resize: fallback for physical window resize and DevTools handle drag
    window.addEventListener("resize", update);
    return () => {
      mqls.forEach((mql) => mql.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, [theme]);

  return size;
}
