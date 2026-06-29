import type { DeepPartial, Prettify } from "../types/utils.types";
import type { ThemeBreakpointKey } from "./generators/system-css.types";
import type { ThemeComponents } from "./theme.components.types";
import type { Macros } from "./theme.macros.types";

// ─── CSS Value Types ──────────────────────────────────────────────────────────
/** Unidades CSS válidas para valores de longitud. */
export type CSSUnit =
  | "px"
  | "rem"
  | "em"
  | "%"
  | "vh"
  | "vw"
  | "vmin"
  | "vmax"
  | "ch"
  | "ex"
  | "pt"
  | "pc"
  | "cm"
  | "mm"
  | "in"
  | "svh"
  | "svw"
  | "dvh"
  | "dvw";

export type CSSLength = `${number}${CSSUnit}` | "0";
export type CSSLengthOrKeyword =
  | CSSLength
  | "auto"
  | "fit-content"
  | "min-content"
  | "max-content"
  | "none";

export type CSSColor = string;

// ─── Scales Range ──────────────────────────────────────────────────────────
export interface CustomScales {}
export type Scales =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "full"
  | keyof CustomScales;

export type ScaleRange<S extends Scales> = S;

export type SpacingScale = ScaleRange<"xs" | "sm" | "md" | "lg" | "xl" | "2xl">;
export type FontSizeScale = ScaleRange<SpacingScale | "3xl" | "4xl">;
export type RadiiScale = ScaleRange<"none" | "sm" | "md" | "lg" | "full">;
export type ShadowScale = ScaleRange<"sm" | "md" | "lg" | "xl">;
export type ControlHeightScale = ScaleRange<"sm" | "md" | "lg">;

// ─── Merge ──────────────────────────────────────────────────────────
/** Fusiona `Base` con `Custom` — las keys de `Custom` sobreescriben las de `Base`. */
export type MergeBaseCustoms<Base, Custom> = Prettify<
  Base & {
    [K in keyof Custom]: Custom[K];
  }
>;

/** Versión parcial de `MergeBaseCustoms` — para overrides opcionales. */
export type MergeBaseCustomsOverride<Base, Custom> = Prettify<
  Partial<Base> & Partial<{ [K in keyof Custom]: Custom[K] }>
>;

/** Override parcial de colores — permite sobreescribir matices individuales sin dar toda la escala. */
export type MergeColorsOverride<Base, Custom> = Prettify<
  { [K in keyof Base]?: DeepPartial<Base[K]> } & {
    [K in keyof Custom]?: Custom[K];
  }
>;

// ─── Color ───────────────────────────────────────────────────────────────
export type ColorScale = {
  50: CSSColor;
  100: CSSColor;
  200: CSSColor;
  300: CSSColor;
  400: CSSColor;
  500: CSSColor;
  600: CSSColor;
  700: CSSColor;
  800: CSSColor;
  900: CSSColor;
  950: CSSColor;
};
export interface BaseColors {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  danger: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  info: ColorScale;
}

// ─── Typography ───────────────────────────────────────────────────────────────
export interface BaseTypography {
  fontSans: string;
  fontMono: string;
  trackingTight: string;
  weightHeading: number | string;
}

/** Sombras en los 4 niveles de elevación — valores `box-shadow` completos. */
export interface BaseShadows extends Record<ShadowScale, string> {}

// ─── Motion ──────────────────────────────────────────────────────────────────
export interface BaseMotion {
  easeDefault: string;
  easeIn: string;
  durFast: string;
  durState: string;
  durLayout: string;
}

// ─── Semantic Colors ──────────────────────────────────────────────────────────────────
export interface BaseSemanticColors {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  surfaceSunken: string;
  border: string;
  borderStrong: string;
  text: string;
  textSubtle: string;
  textDisabled: string;
}

export interface ThemeSemanticLayer {
  dark: Partial<BaseSemanticColors>;
  light: Partial<BaseSemanticColors>;
}

// ─── Extensiónes por el usuario ─────────────────────────────────────────────────
export interface CustomTheme {}
export interface CustomTypography {}
export interface CustomShadows {}
export interface CustomMotion {}
export interface CustomSemanticColors {}
export interface CustomColors {}
export interface CustomSpacing {}
export interface CustomRadii {}
export interface CustomFontSizes {}

export interface BaseSpacing extends Record<SpacingScale, CSSLength> {}
export interface BaseRadii extends Record<RadiiScale, CSSLength> {}
export interface BaseFontSizes extends Record<FontSizeScale, CSSLength> {}
export interface BaseBreakpoints extends Record<ThemeBreakpointKey, CSSLength> {}
export type ThemeTypography = MergeBaseCustoms<BaseTypography, CustomTypography>;
export type ThemeShadows = MergeBaseCustoms<BaseShadows, CustomShadows>;
export type ThemeMotion = MergeBaseCustoms<BaseMotion, CustomMotion>;
export type ThemeSemanticColors = MergeBaseCustoms<BaseSemanticColors, CustomSemanticColors >;

// ─── Tipos finales ────────────────────────────────────────────────────────────
export type ThemeColors = MergeBaseCustoms<BaseColors, CustomColors>;
export type ThemeSpacing = MergeBaseCustoms<BaseSpacing, CustomSpacing>;
export type ThemeRadii = MergeBaseCustoms<BaseRadii, CustomRadii>;
export type ThemeFontSizes = MergeBaseCustoms<BaseFontSizes, CustomFontSizes>;
export type ThemeBreakpoints = Prettify<BaseBreakpoints>;

// ─── Dark Theme ────────────────────────────────────────────────────────────
export type DarkThemeOverride = {
  colors?: MergeColorsOverride<BaseColors, CustomColors>;
  shadows?: Partial<BaseShadows>;
  semantic?: Partial<BaseSemanticColors>;
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
  typography?: Partial<ThemeTypography>;
  shadows?: Partial<ThemeShadows>;
  motion?: Partial<ThemeMotion>;
  semantic?: ThemeSemanticLayer;
  dark?: DarkThemeOverride;
};

export interface Theme extends CustomTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  fontSizes: ThemeFontSizes;
  breakpoints: ThemeBreakpoints;
  cssVarPrefix: string;
  macros: Macros;
  components: ThemeComponents;
  typography: ThemeTypography;
  shadows: ThemeShadows;
  motion: ThemeMotion;
  semantic?: ThemeSemanticLayer;
  dark?: DarkThemeOverride;
}

export type ColorScheme = "light" | "dark";
