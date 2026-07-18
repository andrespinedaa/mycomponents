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
import { useResize } from "../hooks/useResize";

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

function resolveBreakpointSize(theme: Theme, viewportW: number): Scales {
  const sorted = Object.entries(theme.breakpoints)
    .map(([name, val]) => ({ name: name as Scales, px: parseInt(val) }))
    .sort((a, b) => a.px - b.px);

  return sorted.filter((bp) => viewportW >= bp.px).at(-1)?.name ?? sorted[0]!.name;
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
  const resize = useResize();
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

  const sizeResponsive = useMemo(() => resolveBreakpointSize(theme, resize), [theme, resize]);
  const ctxValue = useMemo<ThemeContextValue>(
    () => ({ theme, sizeResponsive, colorScheme, setColorScheme, toggleColorScheme }),
    [theme, sizeResponsive, colorScheme, toggleColorScheme],
  );

  return <ThemeContext.Provider value={ctxValue}>{children}</ThemeContext.Provider>;
}
