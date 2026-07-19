import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { CardConfig } from "./Card";
import { CardSectionThemeComponent } from "./CardSectionTheme";

export type CardTheme = ThemeComponentConfig<CardConfig>;

export const CardThemeComponent: CardTheme = {
  // prettier-ignore
  sizes: {
    xs: { minW: "300px",  maxW: "355px",  minH: "350px",  maxH: "505px"  },
    sm: { minW: "355px",  maxW: "405px",  minH: "455px",  maxH: "505px"  },
    md: { minW: "405px",  maxW: "740px",  minH: "455px",  maxH: "790px"  },
    lg: { minW: "740px",  maxW: "1000px", minH: "790px",  maxH: "1050px" },
    xl: { minW: "1000px", maxW: "1300px", minH: "1050px", maxH: "1300px" },
  },
  variants: {
    border: "none",
    rounded: "lg",
    bg: "neutral.50",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",

    Outlined: {
      border: "2px solid",
      borderColor: "neutral.200",
      hover: { borderColor: "primary.400" },
    },
    Elevated: {
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      hover: { boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 28px 64px rgba(0,0,0,0.16)" },
    },
  },
  statics: {
    Section: CardSectionThemeComponent,
  },
  orientation: {
    horizontal: {
      minW: "$minH",
      maxW: "$maxH",
      minH: "$minW",
      maxH: "$maxW",
    },
  },
};
