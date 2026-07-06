import { useCallback, useEffect, useInsertionEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { generateComponents } from "./generators/generateComponents";
import { generateResponsive } from "./generators/generateResponsive";
import { generateTokens } from "./generators/generateTokens";
import type { ColorScheme, Theme } from "./theme.types";

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

export function ThemeProvider({ theme, defaultColorScheme = "light", children }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = useCallback(() => setColorScheme((s) => (s === "light" ? "dark" : "light")), []);

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

  const ctxValue = useMemo(
    () => ({ theme, colorScheme, setColorScheme, toggleColorScheme }),
    [theme, colorScheme, toggleColorScheme],
  );

  return <ThemeContext.Provider value={ctxValue}>{children}</ThemeContext.Provider>;
}
