import type { Theme } from "../theme/core/theme.types";
import { defaultThemeMacros } from "../theme/core/theme.macros.data";
import { defaultThemeComponents } from "../theme/core/theme.components.data";

// ─── Graphite — "Azul señal sobre slate, compacto y sharp" ───────────────────
// (Formerly "Mineral" in the initial proposal)
// Blue primary · cyan secondary · slate neutral
// Sharp radii (4/6/8px) · compact spacing · standard controls

export const graphiteTheme: Theme = {
  cssVarPrefix: "mycomponents",

  colors: {
    primary: {
      50: "#eff6ff",
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
    secondary: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
      950: "#083344",
    },
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },
    danger: {
      50: "#fef2f2",
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
      50: "#ecfdf5",
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
      50: "#fffbeb",
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
      50: "#eff6ff",
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

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
  },

  radii: {
    none: "0",
    xs:   "2px",
    sm:   "4px",
    md:   "6px",
    lg:   "8px",
    full: "9999px",
  },

  fontSizes: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "28px",
    "4xl": "38px",
  },

  typography: {
    fontSans:
      "'Inter','Inter var',system-ui,-apple-system,'Segoe UI',sans-serif",
    fontMono: "ui-monospace,'SF Mono','JetBrains Mono','Menlo',monospace",
    trackingTight: "-0.014em",
    weightHeading: 650,
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,.45)",
    md: "0 2px 6px rgba(0,0,0,.45), 0 6px 16px rgba(0,0,0,.40)",
    lg: "0 10px 28px rgba(0,0,0,.50)",
    xl: "0 18px 48px rgba(0,0,0,.60)",
  },

  motion: {
    easeDefault: "cubic-bezier(.4,0,.2,1)",
    easeIn: "cubic-bezier(.4,0,1,1)",
    durFast: "150ms",
    durState: "200ms",
    durLayout: "300ms",
  },

  semantic: {
    dark: {
      background: "neutral.950",
      surface: "neutral.900",
      surfaceRaised: "neutral.800",
      surfaceHover: "neutral.800",
      surfaceSunken: "#000000",
      border: "neutral.800",
      borderStrong: "neutral.700",
      text: "neutral.50",
      textSubtle: "neutral.400",
      textDisabled: "neutral.600",
    },
    light: {
      background: "neutral.50",
      surface: "#ffffff",
      surfaceRaised: "#ffffff",
      surfaceHover: "neutral.100",
      surfaceSunken: "neutral.100",
      border: "neutral.200",
      borderStrong: "neutral.300",
      text: "neutral.900",
      textSubtle: "neutral.500",
      textDisabled: "neutral.400",
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
    xs: "150px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  macros: defaultThemeMacros,

  components: defaultThemeComponents,
};
