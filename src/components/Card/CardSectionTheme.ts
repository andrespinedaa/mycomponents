import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  componentName: "SectionMy",
  parentName: "Card",
  sizes: {
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  sections: {
    header: {
      default: { borderBottom: "1px solid $borderColor" },
    },
    body: { default: { flex: "1" } },
    footer: { default: { borderTop: "1px solid $borderColor" } },
    media: { default: { overflow: "hidden" } },
  },
};
