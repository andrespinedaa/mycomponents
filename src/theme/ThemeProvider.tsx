import {
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { resetRegistry } from "../system/css-registry";
import { ThemeContext } from "./ThemeContext";
import { generateResponsive } from "./generators/generateResponsive";
import { generateTokens } from "./generators/generateTokens";
import type { ColorScheme, Theme } from "./theme.types";

export interface ThemeProviderProps {
  theme: Theme;
  defaultColorScheme?: ColorScheme;
  children: ReactNode;
}

export function injectStyle(id: string, css: string): void {
  if (!css || typeof document === "undefined") return;
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export function ThemeProvider({
  theme,
  defaultColorScheme = "light",
  children,
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = () =>
    setColorScheme((s) => (s === "light" ? "dark" : "light"));

  const prevTokensRef = useRef<string>("");
  const prevResponsiveRef = useRef<string>("");

  useInsertionEffect(() => {
    const prefix = theme.cssVarPrefix;

    const tokensCss = generateTokens(theme);
    if (tokensCss !== prevTokensRef.current) {
      prevTokensRef.current = tokensCss;
      injectStyle(`${prefix}-tokens`, tokensCss);
    }

    const responsiveCss = generateResponsive(theme);
    if (responsiveCss !== prevResponsiveRef.current) {
      prevResponsiveRef.current = responsiveCss;
      injectStyle(`${prefix}-responsive`, responsiveCss);
    }

    return () => {
      [`${prefix}-tokens`, `${prefix}-responsive`].forEach((id) =>
        document.getElementById(id)?.remove(),
      );
      // Limpia el registry para que los componentes re-inyecten su CSS al montar.
      // Cubre dos casos: Strict Mode (doble mount en dev) y cambio de tema en runtime.
      resetRegistry();
    };
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.colorScheme = colorScheme;
    return () => {
      delete document.documentElement.dataset.colorScheme;
    };
  }, [colorScheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, colorScheme, setColorScheme, toggleColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
