import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardConfig } from "./Card";
import { CardSectionThemeComponent } from "./CardSectionTheme";

export type CardTheme = ThemeComponentConfig<CardConfig>;

export const CardThemeComponent: CardTheme = {
  sizes: {
    xs: { w: "120px", h: "240px" },
    sm: { w: "220px", h: "340px" },
    md: { w: "300px", h: "440px" },
    lg: { w: "320px", h: "440px" },
    xl: { w: "480px", h: "600px" },
  },
  variants: {
    bg: "neutral.50",
    rounded: "20px",
    overflow: "hidden",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
    cursor: "pointer",
    hover: { boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.12)" },

    Outlined: {
      boxShadow: "none",
      border: "1px solid",
      borderColor: "neutral.200",
      hover: { borderColor: "primary.400", boxShadow: "none" },
    },
    Filled: {
      bg: "primary.50",
      boxShadow: "none",
    },
    Elevated: {
      boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 20px 48px rgba(0,0,0,0.12)",
      hover: { boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 28px 64px rgba(0,0,0,0.16)" },
    },
  },
  statics: {
    Section: CardSectionThemeComponent,
  },
  presets: {},
};
