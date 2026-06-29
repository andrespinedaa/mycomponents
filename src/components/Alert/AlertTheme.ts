import type { ThemeComponentConfig } from "../../theme";
import type { AlertConfig } from "./Alert";

export type AlertThemeConfig = ThemeComponentConfig<AlertConfig>;

export const AlertThemeComponent: AlertThemeConfig = {
  prefix: "alert",
  defaultProps: { severity: "info", variant: "Subtle", size: "md" },
  sizes: {
    sm: { p: "8px",  fontSize: "12px", rounded: "sm" },
    md: { p: "12px", fontSize: "13px", rounded: "md" },
    lg: { p: "16px", fontSize: "14px", rounded: "lg" },
  },
};
