import type { ThemeComponentConfig } from "../../theme/theme.components.types";
import type { ButtonConfig } from "./Button";

type ButtonThemeConfig = ThemeComponentConfig<ButtonConfig>;

export const ButtonThemeComponent: ButtonThemeConfig = {
  prefix: "btn",
  defaultProps: { variant: "Filled", size: "md" },
  sizes: {
    xs: { h: "24px", fontSize: "11px", px: "8px"  },
    sm: { h: "28px", fontSize: "12px", px: "10px" },
    md: { h: "32px", fontSize: "13px", px: "12px" },
    lg: { h: "36px", fontSize: "14px", px: "16px" },
    xl: { h: "40px", fontSize: "15px", px: "20px" },
  },
  variants: {
    Filled: {
      base: {
        bg: "primary.500",
        color: "neutral.50",
        border: "none",
        boxShadow: "none",
      },
      hover: { bg: "primary.600" },
      focus: {
        bg: "primary.600",
        outline: "2px solid",
        outlineColor: "primary.500",
        outlineOffset: "2px",
      },
      active: { bg: "primary.700" },
      disabled: {
        bg: "neutral.200",
        color: "neutral.400",
        cursor: "not-allowed",
      },
      loading: { bg: "primary.300", cursor: "wait" },
    },
    Outlined: {
      base: {
        bg: "transparent",
        color: "primary.500",
        border: "1px solid",
        borderColor: "primary.500",
      },
      hover: { bg: "primary.50" },
      active: { bg: "primary.100" },
      disabled: {
        color: "neutral.400",
        borderColor: "neutral.300",
        cursor: "not-allowed",
      },
    },
    Ghost: {
      base: { bg: "transparent", color: "primary.500", border: "none" },
      hover: { bg: "primary.50" },
      active: { bg: "primary.100" },
      disabled: { color: "neutral.400", cursor: "not-allowed" },
    },
    Elevated: {
      base: {
        bg: "neutral.50",
        color: "primary.500",
        border: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      },
      hover: { boxShadow: "0 4px 6px rgba(0,0,0,0.12)" },
      active: { boxShadow: "0 1px 2px rgba(0,0,0,0.08)" },
      disabled: {
        bg: "neutral.100",
        color: "neutral.400",
        boxShadow: "none",
        cursor: "not-allowed",
      },
    },
  },
};
