import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  parentName: "Card",
  sizes: {
    xs: { flex: "1", minH: "80px" },
    sm: { flex: "1", minH: "120px" },
    md: { flex: "1", minH: "160px" },
    lg: { flex: "1", minH: "200px" },
    xl: { flex: "1", minH: "240px" },
  },
  variants: {
    zIndex: "1",
    position: "relative",
    display: "flex",
  },
  slots: {
    header: {
      display: "flex",
      justify: "space-around",
      presets: {
        bottom: {
          align: "end",
          flex: "2",
        },
        top: {
          align: "start",
          flex: "1",
        },
      },
    },
    body: {
      flexDir: "column",
      align: "start",
      fontFamily: "monospace",
    },
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
