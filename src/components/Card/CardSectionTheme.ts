import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  parentName: "Card",
  componentName: "CardSection",
  sizes: {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
  },
  variants: {
    w: "100%",
    zIndex: "1",
    position: "relative",
    display: "flex",
  },
  slots: {
    media: {
      flex: "1",
      overflow: "hidden",
      backgroundRepeat: "no-repeat",
      presets: {
        cover: {
          p: "0",
          inset: "0",
          zIndex: "0",
          rounded: "md",
          position: "absolute",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        top: { backgroundPosition: "center top" },
        bottom: { backgroundPosition: "center bottom" },
      },
    },
  },
};
