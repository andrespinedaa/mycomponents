import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  parentName: "Card",
  sizes: {
    xs: {p: "sm"},
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  sections: {
    slots: {
      header: { borderBottom: "1px solid $borderColor" },
      body: { flex: "1" },
      footer: { borderTop: "1px solid $borderColor" },
      media: {
        overflow: "hidden",
        backgroundRepeat: "no-repeat",
        presets: {
          cover: { backgroundSize: "cover", backgroundPosition: "center" },
          alignTop: { backgroundPosition: "center top" },
          alignBottom: { backgroundPosition: "center bottom" },
        },
      },
    },
  },
};
