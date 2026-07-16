import type { ThemeComponentConfig } from "../../theme";
import type { AlertConfig } from "./Alert";

export type AlertThemeConfig = ThemeComponentConfig<AlertConfig>;

export const AlertThemeComponent: AlertThemeConfig = {
  sizes: {
    xs: {},
    xl: {},
    sm: { p: "8px", fontSize: "12px" },
    md: { p: "12px", fontSize: "13px" },
    lg: { p: "16px", fontSize: "14px" },
  },

  variants: {
    display: "flex",
    gap: "sm",
    rounded: "md",
    border: "1px solid",
  }
};
