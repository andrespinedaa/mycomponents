import type { ThemeComponentConfig } from "../../theme";
import type { DotConfig } from "./Dot";

export type DotThemeConfig = ThemeComponentConfig<DotConfig>;

export const DotThemeComponent: DotThemeConfig = {
  sizes: {
    xs: { h: "5px", w: "5px", fontSize: "xs" },
    sm: { h: "8px", w: "8px", fontSize: "sm" },
    md: { h: "10px", w: "10px", fontSize: "md" },
    lg: { h: "12px", w: "12px", fontSize: "md" },
    xl: { h: "16px", w: "16px", fontSize: "lg" },
  },
  variants: {
    rounded: "full",
    align: "center",
    display: "inline-flex",
    Subtle: { bg: "primary.100", color: "primary.700" },
    Outlined: {
      bg: "transparent",
      color: "primary.600",
      border: "1px solid",
      borderColor: "primary.500",
    },
  },
};
