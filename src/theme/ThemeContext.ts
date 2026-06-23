import { useCreateProvider } from "../hooks/useCreateProvider";
import type { ColorScheme, Theme } from "./theme.types";

export interface ThemeContextValue {
  theme: Theme;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const [ThemeContextProvider, useThemeContext] =
  useCreateProvider<ThemeContextValue>("ThemeContext");
