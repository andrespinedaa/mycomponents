import type { ThemeComponentConfig } from "../../theme";
import type { BadgeConfig } from "./Badge";

export type BadgeThemeConfig = ThemeComponentConfig<BadgeConfig>;

export const BadgeThemeComponent: BadgeThemeConfig = {
  sizes: {
    xs: { h: "md", w: "70px", fontSize: "xs", rounded: "md", px: "xs", gap: "xs" },
    sm: { h: "md", w: "80px", fontSize: "xs", rounded: "md", px: "xs", gap: "xs" },
    md: { h: "20px", w: "90px", fontSize: "sm", rounded: "md", px: "xs", gap: "xs" },
    lg: { h: "25px", w: "90px", fontSize: "md", rounded: "lg", px: "xs", gap: "xs" },
    xl: { h: "30px", w: "100px", fontSize: "lg", rounded: "lg", px: "xs", gap: "xs" },
  },
  variants: {
    fontFamily: "monospace",
    display: "flex",
    justify: "start",
    align: "center",
    bg: "neutral.100",
    color: "neutral.900",
    Subtle: { bg: "primary.100", color: "primary.700" },
    Outlined: {
      bg: "transparent",
      color: "primary.600",
      border: "1px solid",
      borderColor: "primary.400",
    },
  },
};
