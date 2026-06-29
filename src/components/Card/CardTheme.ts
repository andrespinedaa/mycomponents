import type { ThemeComponentConfig } from "../../theme/theme.components.types";
import type { CardConfig } from "./Card";

export type CardTheme = ThemeComponentConfig<CardConfig>;

export const CardThemeComponent: CardTheme = {
  prefix: "card",
  defaultProps: { orientation: "vertical", variant: "Default", size: "md" },
  sizes: {
    sm: { p: "12px", rounded: "sm" },
    md: { p: "16px", rounded: "md" },
    lg: { p: "24px", rounded: "lg" },
    xl: { p: "32px", rounded: "lg" },
  },
  variants: {
    Default: {
      base: {
        bg: "neutral.50",
        rounded: "lg",
        border: "1px solid",
        borderColor: "neutral.200",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      },
      hover: { boxShadow: "0 4px 6px rgba(0,0,0,0.08)" },
    },
    Outlined: {
      base: {
        bg: "neutral.50",
        rounded: "lg",
        border: "1px solid",
        borderColor: "neutral.200",
        boxShadow: "none",
      },
      hover: { borderColor: "primary.400" },
    },
    Filled: {
      base: {
        bg: "primary.50",
        rounded: "lg",
        border: "none",
        boxShadow: "none",
      },
    },
    Elevated: {
      base: {
        bg: "neutral.50",
        rounded: "lg",
        border: "none",
        boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
      },
      hover: { boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
    },
  },
};
