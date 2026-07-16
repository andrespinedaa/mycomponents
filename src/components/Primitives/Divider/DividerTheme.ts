import type { ThemeComponentConfig } from "../../../theme";
import type { DividerConfig } from "./Divider"

export type DividerThemeComponent = ThemeComponentConfig<DividerConfig>;

export const DividerTheme: DividerThemeComponent = {
  sizes: {
    xs: { w: "100%", h: "1px" },
    sm: { w: "100%", h: "1px" },
    md: { w: "100%", h: "1px" },
    lg: { w: "100%", h: "1px" },
    xl: { w: "100%", h: "2px" },
  },

  variants: {
    display: "flex",
    align: "center",
    gap: "sm"
  }
};