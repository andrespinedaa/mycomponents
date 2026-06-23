import { useInsertionEffect, useEffect, useRef, useState, type ReactNode } from "react";
import { ThemeContextProvider } from "./ThemeContext";
import type { ColorScheme, Theme } from "./theme.types";
import { generateTokens } from "./generators/generateTokens";
import { generateResponsive } from "./generators/generateResponsive";
import { generateVariants } from "./generators/generateVariants";
import { generateBases } from "./generators/generateBases";

interface ThemeProviderProps {
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const toggleColorScheme = () =>
    setColorScheme((s) => (s === "light" ? "dark" : "light"));

  const prevTokensRef = useRef<string>("");
  const prevResponsiveRef = useRef<string>("");
  const prevVariantsRef = useRef<string>("");
  const prevBasesRef = useRef<string>("");

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

    const variantCss = generateVariants(theme);
    if (variantCss !== prevVariantsRef.current) {
      prevVariantsRef.current = variantCss;
      injectStyle(`${prefix}-variants`, variantCss);
    }

    const basesCss = generateBases(theme);
    if (basesCss !== prevBasesRef.current) {
      prevBasesRef.current = basesCss;
      injectStyle(`${prefix}-base`, basesCss);
    }

    return () => {
      const ids = [`${prefix}-tokens`, `${prefix}-responsive`, `${prefix}-variants`, `${prefix}-base`];
      ids.forEach((id) => document.getElementById(id)?.remove());
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
    <ThemeContextProvider
      value={{ theme, colorScheme, setColorScheme, toggleColorScheme }}
    >
      {children}
    </ThemeContextProvider>
  );
}
