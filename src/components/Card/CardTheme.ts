import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardConfig } from "./Card";
import { CardSectionThemeComponent } from "./CardSectionTheme";

export type CardTheme = ThemeComponentConfig<CardConfig>;

export const CardThemeComponent: CardTheme = {
  sizes: {
    xs: { w: "240px", h: "340px" },
    sm: { w: "220px", h: "340px" },
    md: { w: "300px", h: "440px" },
    lg: { w: "320px", h: "440px" },
    xl: { w: "480px", h: "600px" },
  },
  variants: {
    display: "flex",
    flexDir: "column",
    alignContent: "end",
    border: "none",
    rounded: "20px",
    bg: "neutral.50",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
    p: "xs",

    Outlined: {
      border: "1px solid",
      borderColor: "neutral.200",
      hover: { borderColor: "primary.400" },
    },
    Filled: {
      bg: "primary.50",
    },
    Elevated: {
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      hover: { boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 28px 64px rgba(0,0,0,0.16)" },
    },
  },
  statics: {
    Section: CardSectionThemeComponent,
  },
  orientation: {
    horizontal: {
      flexDir: "row",
      h: "$w",
      w: "$h",
    },
  },
};
