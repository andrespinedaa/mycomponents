import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardConfig } from "./Card";
import { CardSectionThemeComponent } from "./CardSectionTheme";

export type CardTheme = ThemeComponentConfig<CardConfig>;

export const CardThemeComponent: CardTheme = {
  // prettier-ignore
  sizes: {
    xs: { minW: "250px",  maxW: "320px",  minH: "250px",  maxH: "400px" },
    sm: { minW: "320px",  maxW: "370px",  minH: "400px",  maxH: "470px" },
    md: { minW: "370px",  maxW: "420px",  minH: "470px",  maxH: "500px" },
    lg: { minW: "420px",  maxW: "450px",  minH: "500px",  maxH: "530px" },
    xl: { minW: "450px",  maxW: "500px",  minH: "530px",  maxH: "600px" },
  },
  variants: {
    border: "none",
    rounded: "lg",
    bg: "neutral.50",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",

    Outlined: {
      border: "2px solid",
      borderColor: "neutral.200",
      hover: { borderColor: "primary.400" },
    },
    Elevated: {
      shadow: "0 4px 16px rgba(0,0,0,0.4)",
      hover: { shadow: "0 8px 24px rgba(0,0,0,0.10), 0 28px 64px rgba(0,0,0,0.16)" },
    },
  },
  orientation: {
    horizontal: {
      minW: "$minH",
      maxW: "$maxH",
      minH: "$minW",
      maxH: "$maxW",
    },
  },
};
