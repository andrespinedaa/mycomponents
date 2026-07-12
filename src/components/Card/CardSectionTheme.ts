import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  parentName: "Card",
  sizes: {
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  sections: {
    header: { borderBottom: "1px solid $borderColor" },
    body:   { flex: "1" },
    footer: { borderTop: "1px solid $borderColor" },
    media: {
      overflow: "hidden",
      cover:      { objectFit: "cover", w: "100%", h: "100%" },
      alignTop:   { objectPosition: "top" },
      alignBottom: { objectPosition: "bottom" },
    },
  },
};
