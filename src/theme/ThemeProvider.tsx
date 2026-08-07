import React from "react";
import { ThemeContextProvider, type ThemeContextValue } from "../context/ThemeContext";
import { SystemContextProvider, type SystemContextValue } from "../context/SystemContext";
import { generateComponents } from "../system/generators/generateComponents";
import { generateResponsive } from "../system/generators/generateResponsive";
import { generateTokens } from "../system/generators/generateTokens";
import type { ColorScheme, Theme } from "./theme.types";
import { getSmallestBreakpoint } from "./core/resolveBreakpoints";
import { useBreakPoint } from "../hooks/useBreakpoint";

interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
  defaultColorScheme?: ColorScheme;
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

export function ThemeProvider({
  theme,
  children,
  defaultColorScheme = "light",
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = React.useCallback(
    () => setColorScheme((s) => (s === "light" ? "dark" : "light")),
    [],
  );

  const tokensVars = React.useMemo(() => generateTokens(theme), [theme]);

  React.useInsertionEffect(() => {
    injectStyle(`${theme.prefix}-tokens`, tokensVars.tokens);
    injectStyle(`${theme.prefix}-components`, generateComponents(theme, tokensVars.vars));
    injectStyle(`${theme.prefix}-responsive`, generateResponsive(theme));

    return () => {
      [
        `${theme.prefix}-tokens`,
        `${theme.prefix}-components`,
        `${theme.prefix}-responsive`,
      ].forEach(removeStyle);
    };
  }, [theme, tokensVars]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.colorScheme = colorScheme;
    return () => {
      delete document.documentElement.dataset.colorScheme;
    };
  }, [colorScheme]);

  const sizeResponsive = useBreakPoint(theme);
  const smallestBreakpoint = React.useMemo(() => getSmallestBreakpoint(theme), [theme]);

  const ThemectxValue = React.useMemo<ThemeContextValue>(
    () => ({ theme, colorScheme, setColorScheme, toggleColorScheme }),
    [theme, colorScheme, toggleColorScheme],
  );
  const SystemThemeValue = React.useMemo<SystemContextValue>(
    () => ({ tokenVars: tokensVars.vars, sizeResponsive, smallestBreakpoint }),
    [tokensVars, sizeResponsive, smallestBreakpoint],
  );

  return (
    <ThemeContextProvider value={ThemectxValue}>
      <SystemContextProvider value={SystemThemeValue}>{children}</SystemContextProvider>
    </ThemeContextProvider>
  );
}
