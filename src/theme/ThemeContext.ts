import { useCreateProvider } from "../hooks/useCreateProvider";
import type { ColorScheme, Scales, Theme } from "./core/theme.types";

export interface ThemeContextValue {
  theme: Theme;
  sizeResponsive: Scales;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const [ThemeContextProvider, useThemeContext, ThemeContext] =
  useCreateProvider<ThemeContextValue>("ThemeContext");
