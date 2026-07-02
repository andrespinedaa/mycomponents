import type { CSSProperties } from "react";
import type { CaseFormat, Convert } from "../../types/cases.types";
import type { BaseColors, BaseRadii, BaseFontSizes, BaseSpacing, CSSLength } from "../theme.types";

// ─── Responsive ───────────────────────────────────────────────────────────────
export const BREAKPOINT_KEYS = ["base", "sm", "md", "lg", "xl"] as const;
export type BreakpointKey = (typeof BREAKPOINT_KEYS)[number];
export type ThemeBreakpointKey = Exclude<BreakpointKey, "base">;
export type PartialBreakPointKey<T> = Partial<Record<BreakpointKey, T>>;
export type Responsive<T> = T | PartialBreakPointKey<T>;

// ─── PropCategory ─────────────────────────────────────────────────────────────
export type PropCategory = "spacing" | "color" | "radius" | "fontSize" | "raw";

// ─── CSSPropertyName ─────────────────────────────────────────────────────────
export type CSSPropertyName = Extract<keyof CSSProperties, string>;

// ─── StylePropDef ─────────────────────────────────────────────────────────────
export type StylePropDef = {
  properties: CSSPropertyName[];
  category: PropCategory;
  responsive: boolean;
};

// ─── CSSContract ─────────────────────────────────────────────────────────────
export type CSSContract<Format extends CaseFormat = "camel"> = {
  [K in keyof CSSProperties as Convert<K & string, "camel", Format>]?: CSSProperties[K];
};

// ─── PropOverride ─────────────────────────────────────────────────────────────
export type PropOverride<
  CSSProp extends keyof CSSProperties,
  Alias extends string,
  IsResponsive extends boolean = false,
> = {
  cssProp: CSSProp | CSSProp[];
  alias: Alias;
  responsive?: IsResponsive;
  category: PropCategory;
};

// ─── SystemStyleProps ─────────────────────────────────────────────────────────
export type SystemStyleProps<
  Overrides extends readonly PropOverride<any, any, any>[],
  Excluded extends keyof CSSProperties = never,
  Format extends CaseFormat = "camel",
> = {
  [O in Overrides[number] as O["alias"]]?: O["cssProp"] extends (infer P extends keyof CSSProperties)[]
    ? O["responsive"] extends true
      ? Responsive<CSSProperties[P]>
      : CSSProperties[P]
    : O["cssProp"] extends keyof CSSProperties
    ? O["responsive"] extends true
      ? Responsive<CSSProperties[O["cssProp"]]>
      : CSSProperties[O["cssProp"]]
    : never;
} & Omit<
  CSSContract<Format>,
  Extract<keyof CSSContract<Format>, Overrides[number]["cssProp"]> | Convert<Excluded & string, "camel", Format>
>;

// ─── Token value types ────────────────────────────────────────────────────────
// Cada tipo corresponde a una PropCategory y define qué tokens acepta.
// CSSLength como escape hatch: permite "8px", "1.5rem"... sin abrir a string arbitrario.
// Esto evita que el IDE mezcle tokens de distintas categorías en el autocomplete.

type ColorScale = BaseColors[keyof BaseColors];
export type ColorValue = `${keyof BaseColors}.${keyof ColorScale}` | CSSLength;
export type SpacingValue = keyof BaseSpacing | "auto" | "full" | "screen" | "fit" | CSSLength;
export type RadiusValue = keyof BaseRadii | CSSLength;
export type FontSizeValue = keyof BaseFontSizes | CSSLength;

// ─── ExcludedProps ────────────────────────────────────────────────────────────
// Props de CSSProperties que no participan en el sistema de styleProps.
export type ExcludedProps = "animation" | "animationName" | "counterReset" | "counterIncrement" | "quotes" | "content";

// ─── RichStyleProps ───────────────────────────────────────────────────────────
// Override manual de aliases para agregar autocomplete de tokens del tema.
// Reemplaza los tipos genéricos de BaseStyleProps (derivado automático) con tipos ricos.
export type RichStyleProps = {
  bg?: Responsive<ColorValue>;
  color?: Responsive<ColorValue>;
  borderColor?: Responsive<ColorValue>;
  rounded?: Responsive<RadiusValue>;
  w?: Responsive<SpacingValue>;
  h?: Responsive<SpacingValue>;
  minW?: Responsive<SpacingValue>;
  maxW?: Responsive<SpacingValue>;
  minH?: Responsive<SpacingValue>;
  maxH?: Responsive<SpacingValue>;
  m?: Responsive<SpacingValue>;
  mx?: Responsive<SpacingValue>;
  my?: Responsive<SpacingValue>;
  mt?: Responsive<SpacingValue>;
  mr?: Responsive<SpacingValue>;
  mb?: Responsive<SpacingValue>;
  ml?: Responsive<SpacingValue>;
  p?: Responsive<SpacingValue>;
  px?: Responsive<SpacingValue>;
  py?: Responsive<SpacingValue>;
  pt?: Responsive<SpacingValue>;
  pr?: Responsive<SpacingValue>;
  pb?: Responsive<SpacingValue>;
  pl?: Responsive<SpacingValue>;
  gap?: Responsive<SpacingValue>;
  rowGap?: Responsive<SpacingValue>;
  columnGap?: Responsive<SpacingValue>;
  top?: Responsive<SpacingValue>;
  right?: Responsive<SpacingValue>;
  bottom?: Responsive<SpacingValue>;
  left?: Responsive<SpacingValue>;
  inset?: Responsive<SpacingValue>;
  fontSize?: Responsive<FontSizeValue>;
};
