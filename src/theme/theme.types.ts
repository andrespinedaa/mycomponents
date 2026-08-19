import type { DeepPartial, Prettify } from "../utils/utils.types";
import type { Macros } from "./core/macros/theme.macros.types";
import type { ThemeComponents } from "./core/theme.components.types";

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── HELPERS ───────
// ════════════════════════════════════════════════════════════════════════════════════════
type MergeBaseCustoms<Base, Custom> = Prettify<
  Base & {
    [K in keyof Custom]: Custom[K];
  }
>;
type MergeBaseCustomsOverride<Base, Custom> = Prettify<
  Partial<Base> & Partial<{ [K in keyof Custom]: Custom[K] }>
>;

type MergeColorsOverride<Base, Custom> = Prettify<
  { [K in keyof Base]?: DeepPartial<Base[K]> } & {
    [K in keyof Custom]?: Custom[K];
  }
>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── CSS VALUES TYPES ───────
// ════════════════════════════════════════════════════════════════════════════════════════
// prettier-ignore
type CSSUnit =
  | "px" | "rem" | "em" | "%" | "vh" | "vw"
  | "vmin" | "vmax" | "ch" | "ex" | "pt"
  | "pc" | "cm" | "mm" | "in" | "svh" | "svw"
  | "dvh" | "dvw";

export type CSSLength = `${number}${CSSUnit}` | "0";
export type VarsCss = Record<string, string>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── SCALE RANGE ───────
// ════════════════════════════════════════════════════════════════════════════════════════
// prettier-ignore
export type Scales = 
  | "xs" | "sm" | "md" | "lg" | "xl" // breakpoitns
  | "2xl" | "3xl" | "4xl" | "full" | "none"  // extensions
  | keyof ConsumerScales; // consumerscales

type ScaleRange<Allowed extends Scales> = Allowed;
type BreakPointsScale = ScaleRange<"xs" | "sm" | "md" | "lg" | "xl">;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── VARIANTS ───────
// ════════════════════════════════════════════════════════════════════════════════════════
// prettier-ignore
export type ComponentVariants =
  | "Filled" | "Outlined" | "Elevated"
  | "Ghost" | "Subtle" | "Link" | "Tonal" | "Soft";

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── STATES ───────
// ════════════════════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════════════════════
// ─────────────────────────────── NATIVE SYSTEM BASES ───────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════════════════
interface BaseBreakpoints extends Record<BreakPointsScale, CSSLength> {}
interface BaseSpacing extends Record<ScaleRange<"2xl"> | BreakPointsScale, CSSLength> {}
interface BaseRadius extends Record<ScaleRange<"full" | "none"> | BreakPointsScale, CSSLength> {}
// prettier-ignore
interface BaseFontSizes extends Record<ScaleRange<"2xl" | "3xl" | "4xl"> | BreakPointsScale, CSSLength> {}
type ColorsShades =
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";
type ColorsNames = "primary" | "secondary" | "neutral" | "danger" | "success" | "warning" | "info";
export type ColorScale = Record<ColorsShades, string>;
interface BaseColors extends Record<ColorsNames, ColorScale> {}

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── BASE TYPOGRAPHY ───────
// ════════════════════════════════════════════════════════════════════════════════════════
interface BaseTypography {
  fontSans: string;
  fontMono: string;
  trackingTight: string;
  weightHeading: number | string;
}

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── BASE SHADOW ───────
// ════════════════════════════════════════════════════════════════════════════════════════
interface BaseShadows extends Record<BreakPointsScale, string> {}

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── BASE NOTION ───────
// ════════════════════════════════════════════════════════════════════════════════════════
type Motions = "easeDefault" | "easeIn" | "durFast" | "durState" | "durLayout";
interface BaseMotion extends Record<Motions, string> {}

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── BASE SEMANTIC COLORS ───────
// ════════════════════════════════════════════════════════════════════════════════════════
// prettier-ignore
type SemanticColors = 
  | "background" | "surface" | "surfaceRaised" | "surfaceHover"
  | "surfaceSunken" | "border" | "borderStrong" | "text" | "textSubtle"
  | "textDisabled";

interface BaseSemanticColors extends Record<SemanticColors, string> {}
interface ThemeSemanticLayer extends Record<ColorScheme, Partial<BaseSemanticColors>> {}

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── EXTENSIONS FOR THE USER ───────
// ════════════════════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── FINAL TYPES ───────
// ════════════════════════════════════════════════════════════════════════════════════════
type ThemeRadius = MergeBaseCustoms<BaseRadius, ConsumerRadius>;
type ThemeMotion = MergeBaseCustoms<BaseMotion, ConsumerMotion>;
type ThemeShadows = MergeBaseCustoms<BaseShadows, ConsumerShadows>;
type ThemeSpacing = MergeBaseCustoms<BaseSpacing, ConsumerSpacing>;
export type ThemeColors = MergeBaseCustoms<BaseColors, ConsumerColors>;
export type ThemeFontSizes = MergeBaseCustoms<BaseFontSizes, ConsumerFontSizes>;
type ThemeTypography = MergeBaseCustoms<BaseTypography, ConsumerTypography>;
export type ThemeBreakpoints = MergeBaseCustoms<BaseBreakpoints, ConsumerBreakPoints>;
type ThemeSemanticColors = MergeBaseCustoms<BaseSemanticColors, ConsumerSemanticColors>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── VALUES TOKENS ───────
// ════════════════════════════════════════════════════════════════════════════════════════
type FontValue = "sans" | "mono";
type RadiusValue = keyof ThemeRadius;
type ShadowValue = keyof ThemeShadows;
type FontSizesValue = keyof ThemeFontSizes;
type ColorsValue =
  | `${keyof ThemeColors}.${keyof ThemeColors[keyof ThemeColors]}`
  | keyof ThemeSemanticColors;
type SpacingValue = keyof ThemeSpacing | "auto" | "full" | "screen" | "fit" | "inherit";
export type CategoryTokens = {
  font: FontValue;
  colors: ColorsValue;
  shadow: ShadowValue;
  radius: RadiusValue;
  spacing: SpacingValue;
  fontSizes: FontSizesValue;
  raw: unknown;
};

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── DARK-THEME ───────
// ════════════════════════════════════════════════════════════════════════════════════════
type DarkThemeOverride = {
  colors?: MergeColorsOverride<BaseColors, ConsumerColors>;
  shadow?: Partial<BaseShadows>;
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
  components?: ThemeComponents;
};

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── THEME ───────
// ════════════════════════════════════════════════════════════════════════════════════════
export interface Theme extends ConsumerTheme {
  macros: Macros;
  radius: ThemeRadius;
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
