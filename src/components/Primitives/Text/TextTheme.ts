import type { ThemeComponentConfig } from "../../../theme";
import type { TextConfig } from "./Text";

export type TextThemeComponent = ThemeComponentConfig<TextConfig>;

export const TextTheme: TextThemeComponent = {
  variants: {
    m: "0px",
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
