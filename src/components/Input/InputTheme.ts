import type { ThemeComponentConfig } from "../../theme";
import type { InputConfig } from "./Input";

export type InputThemeConfig = ThemeComponentConfig<InputConfig>;

export const InputThemeComponent: InputThemeConfig = {
  defaultProps: { size: "md", variant: "Default" },
  sizes: {
    sm: { h: "xs", fontSize: "sm", px: "xs" },
    md: { h: "sm", fontSize: "md", px: "sm" },
    lg: { h: "lg", fontSize: "lg", px: "md" },
  },
};
