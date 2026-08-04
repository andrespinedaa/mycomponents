import { useCreateProvider } from "../hooks/useCreateProvider";
import type { ColorScheme, Scales, Theme, VarsCss } from "./core/theme.types";

export interface ThemeContextValue {
  theme: Theme;
  tokenVars: VarsCss;
  sizeResponsive: Scales;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

export const [ThemeContextProvider, useThemeContext, ThemeContext] =
  useCreateProvider<ThemeContextValue>("ThemeContext");
