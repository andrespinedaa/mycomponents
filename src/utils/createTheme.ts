import { defaultTheme, type Theme, type ThemeOverride } from "../theme";
import { mergeTheme } from "../theme/merge-theme";

export function createTheme(override: ThemeOverride = {}): Theme {
  return mergeTheme(defaultTheme, override);
}
