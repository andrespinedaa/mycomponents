import type { ThemeComponentConfig } from "../../../theme";
import type { TextConfig } from "./Text";

export type TextThemeComponent = ThemeComponentConfig<TextConfig>;

export const TextTheme: TextThemeComponent = {
  variants: {
    fontFamily: "sans",
  },
  sizes: {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
  },
};
