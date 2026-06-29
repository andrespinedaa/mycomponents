import type { ThemeComponentConfig } from "../../theme";
import type { BadgeConfig } from "./Badge";

export type BadgeThemeConfig = ThemeComponentConfig<BadgeConfig>;

export const BadgeThemeComponent: BadgeThemeConfig = {
  prefix: "badge",
  defaultProps: { variant: "Filled", size: "md" },
  sizes: {
    sm: { px: "xs",  py: "xs",  fontSize: "xs", rounded: "full" },
    md: { px: "sm",  py: "xs",  fontSize: "sm", rounded: "full" },
    lg: { px: "md",  py: "sm",  fontSize: "md", rounded: "full" },
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
