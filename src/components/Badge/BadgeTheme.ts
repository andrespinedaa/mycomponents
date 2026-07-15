import type { ThemeComponentConfig } from "../../theme";
import type { BadgeConfig } from "./Badge";

export type BadgeThemeConfig = ThemeComponentConfig<BadgeConfig>;

export const BadgeThemeComponent: BadgeThemeConfig = {
  sizes: {
    xs: { h: "10px", w: "15%", fontSize: "xs" },
    sm: { h: "15px", w: "20%", fontSize: "xs" },
    md: { h: "20px", w: "30%", fontSize: "sm" },
    lg: { h: "25px", w: "35%", fontSize: "md" },
    xl: { h: "30px", w: "40%",  fontSize: "lg"},
  },
  variants: {
    fontFamily: "monospace",
    px: "xs",
    gap: "xs",
    display: "flex",
    align: "center",
    bg: "neutral.100",
    color: "neutral.900",
    rounded: "sm",
    Subtle: { bg: "primary.100", color: "primary.700" },
    Outlined: {
      bg: "transparent",
      color: "primary.600",
      border: "1px solid",
      borderColor: "primary.400",
    },
  },
};
