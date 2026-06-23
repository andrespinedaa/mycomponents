import { defaultTheme, type Theme, type ThemeOverride } from ".";
import { mergeTheme } from "./merge-theme";

export function createTheme(override: ThemeOverride = {}): Theme {
  return mergeTheme(defaultTheme, override);
}
