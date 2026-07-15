import type { ThemeComponentConfig } from "../../theme";
import type { BadgeConfig } from "./Badge";

export type BadgeThemeConfig = ThemeComponentConfig<BadgeConfig>;

export const BadgeThemeComponent: BadgeThemeConfig = {
  sizes: {
    xs: { h: "15px", w: "60px", fontSize: "xs", px: "xs", gap: "xs" },
    sm: { h: "15px", w: "30%", fontSize: "xs", px: "xs", gap: "xs" },
    md: { h: "20px", w: "30%", fontSize: "sm", px: "xs", gap: "xs" },
    lg: { h: "25px", w: "35%", fontSize: "md", px: "xs", gap: "xs" },
    xl: { h: "30px", w: "40%", fontSize: "lg", px: "xs", gap: "xs" },
  },
  variants: {
    fontFamily: "monospace",
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
