import { useCreateContext } from "../hooks/useCreateContext";
import type { ColorScheme, Theme } from "../theme/theme.types";

export interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const [ThemeContextProvider, useThemeContext, ThemeContext] =
  useCreateContext<ThemeContextValue>("ThemeContext");
