import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./Card";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  prefix: "card-section",
  prefixParent: "card",
  sizes: {
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  presets: {
    header: {
      default: { fontWeight: "600", borderBottom: "1px solid $borderColor" },
    },
    body: {
      default: { flex: "1" },
    },
    footer: {
      default: { borderTop: "1px solid $borderColor" },
    },
    media: {
      default:    { overflow: "hidden" },
      background: { position: "absolute", inset: "0", objectFit: "cover" },
      top:        { alignSelf: "flex-start" },
      gradient:   { maskImage: "linear-gradient(to bottom, black 60%, transparent)" },
    },
  },
};
