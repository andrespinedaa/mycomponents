import type { Theme } from "../theme/core/theme.types";
import { defaultThemeMacros } from "../theme/core/theme.macros.data";
import { defaultThemeComponents } from "../theme/core/theme.components.data";

// ─── Terra — "Terracota sobre stone, balanceada y warm" ──────────────────────
// Terracotta primary · teal secondary · stone neutral
// Balanced radii (6/9/14px) · standard spacing · mid-height controls

export const terraTheme: Theme = {
  cssVarPrefix: "mycomponents",

  colors: {
    // Terracotta — warm, earthy primary
    primary: {
      50:  "#fdf4f0",
      100: "#fbe6dc",
      200: "#f6c8b4",
      300: "#eea487",
      400: "#e27c57",
      500: "#d35f3a",
      600: "#bd4a28",
      700: "#9c3a20",
      800: "#7d301e",
      900: "#67291d",
      950: "#38130c",
    },
    // Teal — earthy complement
    secondary: {
      50:  "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
      950: "#042f2e",
    },
    // Stone — warm neutral, not cold gray
    neutral: {
      50:  "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
      950: "#0c0a09",
    },
    danger: {
      50:  "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    success: {
      50:  "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },
    warning: {
      50:  "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
    info: {
      50:  "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
  },
  // Balanced spacing
  spacing: {
    xs:    "4px",
    sm:    "8px",
    md:    "16px",
    lg:    "24px",
    xl:    "36px",
    "2xl": "48px",
  },
  // Balanced radii
  radii: {
    none: "0",
    sm:   "6px",
    md:   "9px",
    lg:   "14px",
    full: "9999px",
  },

  fontSizes: {
    xs:    "12px",
    sm:    "13px",
    md:    "15px",
    lg:    "16px",
    xl:    "19px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "40px",
  },

  typography: {
    fontSans: "'Inter','Inter var',system-ui,-apple-system,'Segoe UI',sans-serif",
    fontMono: "ui-monospace,'SF Mono','JetBrains Mono','Menlo',monospace",
    trackingTight: "-0.012em",
    weightHeading: 700,
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,.45)",
    md: "0 2px 6px rgba(0,0,0,.45), 0 6px 16px rgba(0,0,0,.40)",
    lg: "0 10px 28px rgba(0,0,0,.50)",
    xl: "0 18px 48px rgba(0,0,0,.60)",
  },

  motion: {
    easeDefault: "cubic-bezier(.4,0,.2,1)",
    easeIn:      "cubic-bezier(.4,0,1,1)",
    durFast:     "150ms",
    durState:    "200ms",
    durLayout:   "300ms",
  },

  semantic: {
    dark: {
      background:    "neutral.950",
      surface:       "neutral.900",
      surfaceRaised: "neutral.800",
      surfaceHover:  "neutral.800",
      surfaceSunken: "#000000",
      border:        "neutral.800",
      borderStrong:  "neutral.700",
      text:          "neutral.50",
      textSubtle:    "neutral.400",
      textDisabled:  "neutral.600",
    },
    light: {
      background:    "neutral.50",
      surface:       "#ffffff",
      surfaceRaised: "#ffffff",
      surfaceHover:  "neutral.100",
      surfaceSunken: "neutral.100",
      border:        "neutral.200",
      borderStrong:  "neutral.300",
      text:          "neutral.900",
      textSubtle:    "neutral.500",
      textDisabled:  "neutral.400",
    },
  },

  dark: {
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,.45)",
      md: "0 2px 6px rgba(0,0,0,.45), 0 6px 16px rgba(0,0,0,.40)",
      lg: "0 10px 28px rgba(0,0,0,.50)",
      xl: "0 18px 48px rgba(0,0,0,.60)",
    },
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  macros: defaultThemeMacros,
  components: defaultThemeComponents,
};
