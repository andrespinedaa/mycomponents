import type { DeepPartial, Prettify } from "../../utils/utils.types";
import type { Macros } from "./macros/theme.macros.types";
import type { ThemeComponents } from "./theme.components.types";

// ─── Helpers ─────
export type SystemVariants<Allowed extends ComponentVariants> = Allowed;
export type SystemStatus<Allowed extends ComponentStates> = Allowed;
export type ScaleRange<Allowed extends Scales> = Allowed;
export type BreakpointKey = "base" | keyof ThemeBreakpoints;
export type PartialBreakPointKey<T> = Partial<Record<BreakpointKey, T>>;

// ─── CSS Value Types ──────────────────────────────────────────────────────────
// prettier-ignore
export type CSSUnit =
  | "px" | "rem" | "em" | "%" | "vh" | "vw"
  | "vmin" | "vmax" | "ch" | "ex" | "pt"
  | "pc" | "cm" | "mm" | "in" | "svh" | "svw"
  | "dvh" | "dvw";

export type CSSColor = string;
export type CSSLength = `${number}${CSSUnit}` | "0";
export type VarsCss = Record<string, string>;

// ─── Scales Range ──────────────────────────────────────────────────────────
// prettier-ignore
export type Scales = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full" | "none" | keyof ConsumerScales;
export type BreakPointsScale = ScaleRange<"xs" | "sm" | "md" | "lg" | "xl">;
export type ShadowScale = ScaleRange<BreakPointsScale>;
export type SpacingScale = ScaleRange<BreakPointsScale | "2xl">;
export type RadiiScale = ScaleRange<BreakPointsScale | "full" | "none">;
export type FontSizeScale = ScaleRange<BreakPointsScale | "2xl" | "3xl" | "4xl">;

// ─── Variants ──────────────────────────────────────────────────────────
// prettier-ignore
export type ComponentVariants =
  | "Filled" | "Outlined" | "Elevated"
  | "Ghost" | "Subtle"
  | "Link" | "Tonal" | "Soft";

// ─── States ──────────────────────────────────────────────────────────
// prettier-ignore
export type ComponentStates =
  // Interaction
  | "hover" | "focus" | "focusVisible" | "focusWithin" | "active"
  // Form
  | "disabled" | "checked" | "indeterminate" | "required"
  | "invalid" | "valid" | "readOnly" | "placeholder" | "autofill"
  // System data-attributes
  | "loading" | "selected"
  // Pseudo-elements
  | "before" | "after" | "selection" | "marker"
  // Structural
  | "firstChild" | "lastChild" | "empty";

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

// ─── Bases ───────────────────────────────────────────────────────────────
export interface BaseRadius extends Record<RadiiScale, CSSLength> {}
export interface BaseSpacing extends Record<SpacingScale, CSSLength> {}
export interface BaseFontSizes extends Record<FontSizeScale, CSSLength> {}
export interface BaseBreakpoints extends Record<BreakPointsScale, CSSLength> {}

// ─── Base Color ───────────────────────────────────────────────────────────────
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

// ─── Base typography ───────────────────────────────────────────────────────────────
export interface BaseTypography {
  fontSans: string;
  fontMono: string;
  trackingTight: string;
  weightHeading: number | string;
}

// ─── Shadow ──────────────────────────────────────────────────────────────────
export interface BaseShadows extends Record<ShadowScale, CSSColor> {}

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
export interface ConsumerTheme {}
export interface ConsumerRadius {}
export interface ConsumerScales {}
export interface ConsumerMotion {}
export interface ConsumerColors {}
export interface ConsumerShadows {}
export interface ConsumerSpacing {}
export interface ConsumerFontSizes {}
export interface ConsumerTypography {}
export interface ConsumerBreakPoints {}
export interface ConsumerSemanticColors {}
export interface ConsumerThemeComponents {}

// ─── Values tokens ──────────────────────────────────────────────────────────
export type FontValue = "sans" | "mono";
export type RadiusValue = keyof ThemeRadii;
export type ShadowValue = keyof ThemeShadows;
export type FontSizesValue = keyof ThemeFontSizes;
export type ColorScaleKeys = BaseColors[keyof BaseColors];
export type ColorsValue = `${keyof BaseColors}.${keyof ColorScaleKeys}`;
export type SpacingValue = keyof ThemeSpacing | "auto" | "full" | "screen" | "fit" | "inherit";
export type CategoryTokens = "spacing" | "colors" | "radius" | "fontSizes" | "font" | "raw" | "shadow";

// ─── Tipos finales ────────────────────────────────────────────────────────────
export type ThemeRadii = MergeBaseCustoms<BaseRadius, ConsumerRadius>;
export type ThemeMotion = MergeBaseCustoms<BaseMotion, ConsumerMotion>;
export type ThemeColors = MergeBaseCustoms<BaseColors, ConsumerColors>;
export type ThemeShadows = MergeBaseCustoms<BaseShadows, ConsumerShadows>;
export type ThemeSpacing = MergeBaseCustoms<BaseSpacing, ConsumerSpacing>;
export type ThemeFontSizes = MergeBaseCustoms<BaseFontSizes, ConsumerFontSizes>;
export type ThemeTypography = MergeBaseCustoms<BaseTypography, ConsumerTypography>;
export type ThemeBreakpoints = MergeBaseCustoms<BaseBreakpoints, ConsumerBreakPoints>;
export type ThemeSemanticColors = MergeBaseCustoms<BaseSemanticColors, ConsumerSemanticColors>;

// ─── Dark Theme ────────────────────────────────────────────────────────────
export type DarkThemeOverride = {
  colors?: MergeColorsOverride<BaseColors, ConsumerColors>;
  shadow?: Partial<BaseShadows>;
  semantic?: Partial<BaseSemanticColors>;
};

export type ThemeOverride = {
  macros?: Macros;
  prefix?: string;
  dark?: DarkThemeOverride;
  semantic?: ThemeSemanticLayer;
  motion?: Partial<ThemeMotion>;
  shadow?: Partial<ThemeShadows>;
  typography?: Partial<ThemeTypography>;
  breakpoints?: Partial<ThemeBreakpoints>;
  colors?: MergeColorsOverride<BaseColors, ConsumerColors>;
  radius?: MergeBaseCustomsOverride<BaseRadius, ConsumerRadius>;
  spacing?: MergeBaseCustomsOverride<BaseSpacing, ConsumerSpacing>;
  fontSizes?: MergeBaseCustomsOverride<BaseFontSizes, ConsumerFontSizes>;
  components?: ThemeComponents
};

export interface Theme extends ConsumerTheme {
  macros: Macros;
  radius: ThemeRadii;
  colors: ThemeColors;
  motion: ThemeMotion;
  prefix: string;
  spacing: ThemeSpacing;
  shadow: ThemeShadows;
  dark: DarkThemeOverride;
  fontSizes: ThemeFontSizes;
  components: ThemeComponents;
  typography: ThemeTypography;
  semantic: ThemeSemanticLayer;
  breakpoints: ThemeBreakpoints;
}

export type ColorScheme = "light" | "dark";
