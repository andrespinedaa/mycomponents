import type { ThemeComponentConfig } from "../../theme";
import type { BadgeConfig } from "./Badge";

export type BadgeThemeConfig = ThemeComponentConfig<BadgeConfig>;

export const BadgeThemeComponent: BadgeThemeConfig = {
  sizes: {
    xs: { px: "4px", py: "2px", fontSize: "10px" },
    sm: { px: "6px", py: "2px", fontSize: "11px" },
    md: { px: "8px", py: "3px", fontSize: "12px" },
    lg: { px: "10px", py: "4px", fontSize: "13px" },
  },
  variants: {
    Filled: {
      base: { bg: "primary.500", color: "neutral.50" },
    },
    Subtle: {
      base: { bg: "primary.100", color: "primary.700" },
    },
    Outlined: {
      base: {
        bg: "transparent",
        color: "primary.600",
        border: "1px solid",
        borderColor: "primary.400",
      },
    },
  },
};
