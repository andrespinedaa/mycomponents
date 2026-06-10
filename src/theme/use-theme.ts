import { useThemeContext } from "./ThemeContext";
import { cssVar } from "./resolve-theme";

export function useTheme() {
  const { theme } = useThemeContext();

  // Helper para construir CSS vars desde el tema
  const vars = {
    color: (name: keyof typeof theme.colors, stop: number) =>
      cssVar(theme.cssVarPrefix, `color-${name}-${stop}`),
    spacing: (key: keyof typeof theme.spacing) =>
      cssVar(theme.cssVarPrefix, `spacing-${key}`),
    radius: (key: keyof typeof theme.radii) =>
      cssVar(theme.cssVarPrefix, `radius-${key}`),
    fontSize: (key: keyof typeof theme.fontSizes) =>
      cssVar(theme.cssVarPrefix, `font-size-${key}`),
  };

  return { theme, vars };
}
