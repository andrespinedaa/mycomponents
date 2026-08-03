import { useThemeContext } from "../theme/ThemeContext";

export function cssVar(prefix: string, path: string): string {
  return `var(--${prefix}-${path})`;
}

export function useTheme() {
  const { theme, colorScheme, setColorScheme, toggleColorScheme } =
    useThemeContext();

  const vars = {
    color: (name: keyof typeof theme.colors, stop: number) =>
      cssVar(theme.prefix, `color-${name}-${stop}`),
    spacing: (key: keyof typeof theme.spacing) =>
      cssVar(theme.prefix, `spacing-${key}`),
    radius: (key: keyof typeof theme.radius) =>
      cssVar(theme.prefix, `radius-${key}`),
    fontSize: (key: keyof typeof theme.fontSizes) =>
      cssVar(theme.prefix, `font-size-${key}`),
  };

  return { theme, vars, colorScheme, setColorScheme, toggleColorScheme };
}
