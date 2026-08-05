import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeContextProvider, type ThemeContextValue } from "./ThemeContext";
import { generateComponents } from "./generators/generateComponents";
import { generateResponsive } from "./generators/generateResponsive";
import { generateTokens } from "./generators/generateTokens";
import type { ColorScheme, Theme } from "./core/theme.types";
import { useBreakPoint } from "../hooks/useBreakpoint";

export interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
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
  defaultColorScheme = "light",
  children,
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = useCallback(
    () => setColorScheme((s) => (s === "light" ? "dark" : "light")),
    [],
  );

  const tokensVars = useMemo(() => generateTokens(theme), [theme]);
  console.log(tokensVars);

  useInsertionEffect(() => {
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.colorScheme = colorScheme;
    return () => {
      delete document.documentElement.dataset.colorScheme;
    };
  }, [colorScheme]);

  const sizeResponsive = useBreakPoint(theme);
  const ctxValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      tokenVars: tokensVars.vars,
      sizeResponsive,
      colorScheme,
      setColorScheme,
      toggleColorScheme,
    }),
    [theme, tokensVars, sizeResponsive, colorScheme, toggleColorScheme],
  );

  return <ThemeContextProvider value={ctxValue}>{children}</ThemeContextProvider>;
}
