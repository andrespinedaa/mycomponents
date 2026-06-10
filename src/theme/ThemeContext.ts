import { useCreateProvider } from "../utils/createProvider";
import { defaultTheme } from "./default-theme";
import type { Theme } from "./types";

export interface ThemeContextValue {
  theme: Theme;
}

export const [ThemeContextProvider, useThemeContext] =
  useCreateProvider<ThemeContextValue>("ThemeContext", { theme: defaultTheme });
