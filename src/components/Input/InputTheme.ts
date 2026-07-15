import type { ThemeComponentConfig } from "../../theme";
import type { InputConfig } from "./Input";

export type InputThemeConfig = ThemeComponentConfig<InputConfig>;

export const InputThemeComponent: InputThemeConfig = {
  defaultProps: { size: "md" },
  sizes: {
    xs: { h: "28px", fontSize: "xs", px: "xs" },
    sm: { h: "32px", fontSize: "sm", px: "xs" },
    md: { h: "40px", fontSize: "md", px: "sm" },
    lg: { h: "48px", fontSize: "lg", px: "md" },
    xl: { h: "56px", fontSize: "xl", px: "md" },
  },
  variants: {
    // Flat base (estilo por defecto — sin variant attr)
    bg: "neutral.50",
    color: "neutral.900",
    border: "1px solid",
    borderColor: "neutral.300",
    rounded: "md",
    transition: "border-color 0.15s, box-shadow 0.15s",
    hover:       { borderColor: "neutral.400" },
    focusWithin: { borderColor: "primary.500", boxShadow: "0 0 0 3px rgba(59,130,246,0.15)" },
    disabled:    { bg: "neutral.100", color: "neutral.400", borderColor: "neutral.200", cursor: "not-allowed", opacity: "0.6" },
    invalid:     { borderColor: "danger.500", boxShadow: "0 0 0 3px rgba(239,68,68,0.15)" },

    Filled: {
      bg: "neutral.100",
      borderColor: "transparent",
      transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
      hover:       { bg: "neutral.200" },
      focusWithin: { bg: "neutral.50", borderColor: "primary.500", boxShadow: "0 0 0 3px rgba(59,130,246,0.15)" },
      disabled:    { opacity: "0.6", cursor: "not-allowed" },
      invalid:     { borderColor: "danger.500", boxShadow: "0 0 0 3px rgba(239,68,68,0.15)" },
    },
  },
};
