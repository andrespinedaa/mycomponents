import type { ThemeComponents } from ".";

export const defaultThemeComponents: ThemeComponents = {
  /* Primitives */
  Box: { prefix: "box" },
  Text: { prefix: "text" },
  Divider: { prefix: "divider" },
  Flex: {
    prefix: "flex",
    defaultProps: { display: "flex" },
  },
  Grid: { prefix: "grid" },
  Image: { prefix: "image" },
  Stack: {
    prefix: "stack",
    defaultProps: { display: "flex", flexDir: "column" },
  },

  /* Components */
  Alert: {
    prefix: "alert",
    defaultProps: { severity: "info", variant: "Subtle" },
  },
  Avatar: {
    prefix: "avatar",
    defaultProps: { shape: "circle", size: "md" },
  },
  Badge: {
    prefix: "badge",
    defaultProps: { variant: "Filled", size: "md" },
    variants: {
      Filled: {
        base: { bg: "primary.500", color: "neutral.50" },
      },
      Subtle: {
        base: { bg: "primary.100", color: "primary.700" },
      },
      Outlined: {
        base: {
          bg: "transparent",
          color: "primary.600",
          border: "1px solid",
          borderColor: "primary.400",
        },
      },
    },
  },
  Input: {
    prefix: "input",
    defaultProps: { size: "md", variant: "Default" },
  },
  Button: {
    prefix: "btn",
    defaultProps: { variant: "Filled" },
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
  },
  Card: {
    prefix: "card",
    defaultProps: { orientation: "column", variant: "Default" },
    variants: {
      Default: {
        base: {
          bg: "neutral.50",
          rounded: "lg",
          border: "1px solid",
          borderColor: "neutral.200",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        },
        hover: { boxShadow: "0 4px 6px rgba(0,0,0,0.08)" },
      },
      Outlined: {
        base: {
          bg: "neutral.50",
          rounded: "lg",
          border: "1px solid",
          borderColor: "neutral.200",
          boxShadow: "none",
        },
        hover: { borderColor: "primary.400" },
      },
      Filled: {
        base: {
          bg: "primary.50",
          rounded: "lg",
          border: "none",
          boxShadow: "none",
        },
      },
      Elevated: {
        base: {
          bg: "neutral.50",
          rounded: "lg",
          border: "none",
          boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
        },
        hover: { boxShadow: "0 10px 15px rgba(0,0,0,0.1)" },
      },
    },
  },
};
