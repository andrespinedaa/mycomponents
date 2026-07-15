import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardSectionConfig } from "./CardSection";

export type CardSectionTheme = ThemeComponentConfig<CardSectionConfig>;

export const CardSectionThemeComponent: CardSectionTheme = {
  parentName: "Card",
  sizes: {
    xs: { p: "sm" },
    sm: { p: "sm" },
    md: { p: "md" },
    lg: { p: "lg" },
    xl: { p: "xl" },
  },
  sections: {
    zIndex: "1",
    position: "relative",
    display: "flex",

    slots: {
      header: {
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
        rounded: "md",
        overflow: "hidden",
        backgroundRepeat: "no-repeat",
        presets: {
          cover: {
            p: "0",
            inset: "0",
            zIndex: "0",
            rounded: "0",
            position: "absolute",
            backgroundSize: "cover",
            backgroundPosition: "center",
          },
          alignTop: { backgroundPosition: "center top" },
          alignBottom: { backgroundPosition: "center bottom" },
        },
      },
    },
  },
};
