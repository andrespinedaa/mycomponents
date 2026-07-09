import type { ThemeComponentConfig } from "../../theme";
import type { AlertConfig } from "./Alert";

export type AlertThemeConfig = ThemeComponentConfig<AlertConfig>;

export const AlertThemeComponent: AlertThemeConfig = {
  sizes: {
    sm: { p: "8px",  fontSize: "12px" },
    md: { p: "12px", fontSize: "13px" },
    lg: { p: "16px", fontSize: "14px" },
  },
};
