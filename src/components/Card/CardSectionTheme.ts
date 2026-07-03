import type { ThemeComponentConfig } from "../../theme/theme.components.types";
import type { CardSectionConfig } from "./Card";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  prefix: "card-section",
  slotProp: "section",
  sizes: {
    sm: { p: "8px" },
    md: { p: "12px" },
    lg: { p: "16px" },
    xl: { p: "20px" },
  },
  slots: {
    header: { fontWeight: "600", borderBottom: "1px solid" },
    media:  { overflow: "hidden" },
    body:   { flex: "1" },
    footer: { borderTop: "1px solid" },
  },
};
