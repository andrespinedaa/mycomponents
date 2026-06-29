import type { Theme, ThemeOverride } from ".";
import { mergeTheme } from "./merge-theme";

export function createTheme(base: Theme, override: ThemeOverride = {}): Theme {
  return mergeTheme(base, override);
}
