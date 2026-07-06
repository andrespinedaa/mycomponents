import type { Theme } from "../theme/core/theme.types";
import { defaultThemeMacros } from "../theme/core/theme.macros.data";
import { defaultThemeComponents } from "../theme/core/theme.components.data";

// ─── Halo — "Violeta sobre zinc, espacioso y soft" ────────────────────────────
// Violet primary · pink secondary · zinc neutral
// Large radii (8/12/18px) · generous spacing · tall controls
// Dark-first: neutral.950 = #09090b

export const haloTheme: Theme = {
  cssVarPrefix: "mycomponents",

  colors: {
    // Violet — the Halo signature
    primary: {
      50:  "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
      950: "#2e1065",
    },

    // Pink — Halo secondary accent
    secondary: {
      50:  "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#500724",
    },

    // Zinc — cool, clean neutral
    neutral: {
      50:  "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
    },

    // Shared status colors (same across all themes)
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

  // ─── Spacing (generosa — Halo breathes) ───────────────────────────────────
  spacing: {
    xs:   "6px",
    sm:   "12px",
    md:   "18px",
    lg:   "28px",
    xl:   "40px",
    "2xl":"56px",
  },

  // ─── Radii (soft) ─────────────────────────────────────────────────────────
  radii: {
    none: "0",
    sm:   "8px",
    md:   "12px",
    lg:   "18px",
    full: "9999px",
  },

  // ─── Font sizes (ampliada) ────────────────────────────────────────────────
  fontSizes: {
    xs:   "12px",
    sm:   "13px",
    md:   "15px",
    lg:   "17px",
    xl:   "20px",
    "2xl":"25px",
    "3xl":"32px",
    "4xl":"44px",
  },

  // ─── Typography ───────────────────────────────────────────────────────────
  typography: {
    fontSans: "'Inter','Inter var',system-ui,-apple-system,'Segoe UI',sans-serif",
    fontMono: "ui-monospace,'SF Mono','JetBrains Mono','Menlo',monospace",
    trackingTight: "-0.01em",
    weightHeading: 600,
  },

  // ─── Shadows — dark default (high opacity, Halo lives in the dark) ────────
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,.45)",
    md: "0 2px 6px rgba(0,0,0,.45), 0 6px 16px rgba(0,0,0,.40)",
    lg: "0 10px 28px rgba(0,0,0,.50)",
    xl: "0 18px 48px rgba(0,0,0,.60)",
  },

  // ─── Motion ───────────────────────────────────────────────────────────────
  motion: {
    easeDefault: "cubic-bezier(.4,0,.2,1)",
    easeIn:      "cubic-bezier(.4,0,1,1)",
    durFast:     "150ms",
    durState:    "200ms",
    durLayout:   "300ms",
  },

  // ─── Semantic layer (dark-first) ──────────────────────────────────────────
  // dark = default (`:root`), light = override (`[data-color-scheme=light]`)
  semantic: {
    dark: {
      background:    "neutral.950",   // #09090b
      surface:       "neutral.900",   // #18181b
      surfaceRaised: "neutral.800",   // #27272a
      surfaceHover:  "neutral.800",
      surfaceSunken: "#000000",
      border:        "neutral.800",   // #27272a
      borderStrong:  "neutral.700",   // #3f3f46
      text:          "neutral.50",    // #fafafa
      textSubtle:    "neutral.400",   // #a1a1aa
      textDisabled:  "neutral.600",   // #52525b
    },
    light: {
      background:    "neutral.50",    // #fafafa
      surface:       "#ffffff",
      surfaceRaised: "#ffffff",
      surfaceHover:  "neutral.100",   // #f4f4f5
      surfaceSunken: "neutral.100",
      border:        "neutral.200",   // #e4e4e7
      borderStrong:  "neutral.300",   // #d4d4d8
      text:          "neutral.900",   // #18181b
      textSubtle:    "neutral.500",   // #71717a
      textDisabled:  "neutral.400",   // #a1a1aa
    },
  },

  // ─── Dark mode — light shadows override ───────────────────────────────────
  // (shadows in :root are already the dark values; light mode gets softer ones)
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
