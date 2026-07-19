import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import { generateComponents } from "./generators/generateComponents";
import { generateResponsive } from "./generators/generateResponsive";
import { generateTokens } from "./generators/generateTokens";
import type { ColorScheme, Scales, Theme } from "./core/theme.types";

export interface ThemeProviderProps {
  theme: Theme;
  defaultColorScheme?: ColorScheme;
  children: ReactNode;
}

function injectStyle(id: string, css: string): void {
  if (!css || typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

function removeStyle(id: string): void {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.remove();
}

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

function useBreakpointSize(theme: Theme): Scales {
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

export function ThemeProvider({
  theme,
  defaultColorScheme = "light",
  children,
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = useCallback(
    () => setColorScheme((s) => (s === "light" ? "dark" : "light")),
    [],
  );
  const p = theme.cssVarPrefix;

  useInsertionEffect(() => {
    injectStyle(`${p}-tokens`, generateTokens(theme));
    injectStyle(`${p}-components`, generateComponents(theme));
    injectStyle(`${p}-responsive`, generateResponsive(theme));

    return () => {
      [`${p}-tokens`, `${p}-components`, `${p}-responsive`].forEach(removeStyle);
    };
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.colorScheme = colorScheme;
    return () => {
      delete document.documentElement.dataset.colorScheme;
    };
  }, [colorScheme]);

  const sizeResponsive = useBreakpointSize(theme);
  const ctxValue = useMemo<ThemeContextValue>(
    () => ({ theme, sizeResponsive, colorScheme, setColorScheme, toggleColorScheme }),
    [theme, sizeResponsive, colorScheme, toggleColorScheme],
  );

  return <ThemeContext.Provider value={ctxValue}>{children}</ThemeContext.Provider>;
}
