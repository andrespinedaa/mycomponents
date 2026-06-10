import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContextProvider } from "./ThemeContext";
import { mergeTheme } from "./merge-theme";
import { resolveThemeToCss } from "./resolve-theme";
import type { ColorScheme, ThemeOverride } from "./types";

interface ThemeProviderProps {
  theme?: ThemeOverride;
  defaultColorScheme?: ColorScheme;
  /** Atributo del DOM donde se aplica el color scheme. Default: document.documentElement */
  colorSchemeTarget?: "html" | "body";
  children: ReactNode;
}

export function ThemeProvider({
  theme: themeOverride = {},
  defaultColorScheme = "light",
  colorSchemeTarget = "html",
  children,
}: ThemeProviderProps) {
  const theme = useMemo(() => mergeTheme(themeOverride), [themeOverride]);
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(defaultColorScheme);

  // Inyecta las CSS variables en el DOM
  useEffect(() => {
    const lightCss = resolveThemeToCss(theme, ":root");
    // Para dark mode, el consumer sobreescribe los valores que cambien
    const styleId = `${theme.cssVarPrefix}-theme`;
    let el = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }

    el.textContent = lightCss;
  }, [theme]);

  // Aplica data-color-scheme al elemento raíz — sin re-render de componentes
  useEffect(() => {
    const target =
      colorSchemeTarget === "body" ? document.body : document.documentElement;
    target.setAttribute("data-color-scheme", colorScheme);
  }, [colorScheme, colorSchemeTarget]);

  const toggleColorScheme = () =>
    setColorScheme((s) => (s === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({ theme, colorScheme, setColorScheme, toggleColorScheme }),
    [theme, colorScheme],
  );

  return <ThemeContextProvider value={value}>{children}</ThemeContextProvider>;
}
