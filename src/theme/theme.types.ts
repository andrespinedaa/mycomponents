import type { DeepPartial, Prettify } from "../types/utils.types";
import type { ThemeComponents } from "./theme.components.types";
import type { Macros } from "./theme.macros.types";

export type MergeBaseCustoms<Base, Custom> = Prettify<
  Base & {
    [K in keyof Custom]: Custom[K];
  }
>;

export type MergeBaseCustomsOverride<Base, Custom> = Prettify<
  Partial<Base> & Partial<{ [K in keyof Custom]: Custom[K] }>
>;

export type MergeColorsOverride<Base, Custom> = Prettify<
  { [K in keyof Base]?: DeepPartial<Base[K]> } & {
    [K in keyof Custom]?: Custom[K];
  }
>;

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export interface BaseColors {
  primary: ColorScale;
  neutral: ColorScale;
  danger: ColorScale;
  success: ColorScale;
  warning: ColorScale;
}

export interface BaseSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface BaseRadii {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface BaseFontSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
}

export interface BaseBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// ─── Extensión por el usuario ─────────────────────────────────────────────────
export interface CustomColors {}
export interface CustomSpacing {}
export interface CustomRadii {}
export interface CustomFontSizes {}

// ─── Tipos finales ────────────────────────────────────────────────────────────
export type ThemeColors = MergeBaseCustoms<BaseColors, CustomColors>;
export type ThemeSpacing = MergeBaseCustoms<BaseSpacing, CustomSpacing>;
export type ThemeRadii = MergeBaseCustoms<BaseRadii, CustomRadii>;
export type ThemeFontSizes = MergeBaseCustoms<BaseFontSizes, CustomFontSizes>;
export type ThemeBreakpoints = Prettify<BaseBreakpoints>;

export type DarkThemeOverride = {
  colors?: MergeColorsOverride<BaseColors, CustomColors>;
};

export type ThemeOverride = {
  colors?: MergeColorsOverride<BaseColors, CustomColors>;
  spacing?: MergeBaseCustomsOverride<BaseSpacing, CustomSpacing>;
  radii?: MergeBaseCustomsOverride<BaseRadii, CustomRadii>;
  fontSizes?: MergeBaseCustomsOverride<BaseFontSizes, CustomFontSizes>;
  breakpoints?: Partial<ThemeBreakpoints>;
  cssVarPrefix?: string;
  macros?: Macros;
  components?: ThemeComponents;
  dark?: DarkThemeOverride;
};

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  fontSizes: ThemeFontSizes;
  breakpoints: ThemeBreakpoints;
  cssVarPrefix: string;
  macros: Macros;
  components: ThemeComponents;
  dark?: DarkThemeOverride;
}

export type ColorScheme = "light" | "dark";
