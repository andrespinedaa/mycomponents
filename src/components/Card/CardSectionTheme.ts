import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  componentName: "Section",
  parentName: "Card",
  sizes: {
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  presets: {
    header: { fontWeight: "600", borderBottom: "1px solid $borderColor" },
    body: { flex: "1" },
    footer: { borderTop: "1px solid $borderColor" },
    media: { overflow: "hidden" },
  },
};
