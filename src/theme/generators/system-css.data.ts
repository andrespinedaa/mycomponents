import type {
  CSSContract,
  CSSPropertyName,
  PropOverride,
  Responsive,
  StylePropDef,
  SystemStyleProps,
} from "./system-css.types";
import type {
  BaseColors,
  BaseRadii,
  BaseFontSizes,
  BaseSpacing,
} from "../theme.types";
import type { CSSProperties } from "react";

export const STYLE_PROPS_OVERRIDES = [
  // Margin
  { cssProp: "margin", alias: "m", responsive: true, category: "spacing" },
  {
    cssProp: ["marginLeft", "marginRight"],
    alias: "mx",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: ["marginTop", "marginBottom"],
    alias: "my",
    responsive: true,
    category: "spacing",
  },
  { cssProp: "marginTop", alias: "mt", responsive: true, category: "spacing" },
  {
    cssProp: "marginRight",
    alias: "mr",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: "marginBottom",
    alias: "mb",
    responsive: true,
    category: "spacing",
  },
  { cssProp: "marginLeft", alias: "ml", responsive: true, category: "spacing" },

  // Padding
  { cssProp: "padding", alias: "p", responsive: true, category: "spacing" },
  {
    cssProp: ["paddingLeft", "paddingRight"],
    alias: "px",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: ["paddingTop", "paddingBottom"],
    alias: "py",
    responsive: true,
    category: "spacing",
  },
  { cssProp: "paddingTop", alias: "pt", responsive: true, category: "spacing" },
  {
    cssProp: "paddingRight",
    alias: "pr",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: "paddingBottom",
    alias: "pb",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: "paddingLeft",
    alias: "pl",
    responsive: true,
    category: "spacing",
  },

  // Dimensiones
  { cssProp: "width", alias: "w", responsive: true, category: "spacing" },
  { cssProp: "height", alias: "h", responsive: true, category: "spacing" },
  { cssProp: "minWidth", alias: "minW", responsive: true, category: "spacing" },
  { cssProp: "maxWidth", alias: "maxW", responsive: true, category: "spacing" },
  {
    cssProp: "minHeight",
    alias: "minH",
    responsive: true,
    category: "spacing",
  },
  {
    cssProp: "maxHeight",
    alias: "maxH",
    responsive: true,
    category: "spacing",
  },

  // Colores
  { cssProp: "background", alias: "bg", responsive: false, category: "color" },
  { cssProp: "color", alias: "color", responsive: false, category: "color" },
  {
    cssProp: "borderColor",
    alias: "borderColor",
    responsive: false,
    category: "color",
  },

  // Bordes
  {
    cssProp: "borderRadius",
    alias: "rounded",
    responsive: false,
    category: "radius",
  },

  // Flexbox
  {
    cssProp: "flexDirection",
    alias: "flexDir",
    responsive: true,
    category: "raw",
  },
  { cssProp: "alignItems", alias: "align", responsive: true, category: "raw" },
  {
    cssProp: "justifyContent",
    alias: "justify",
    responsive: true,
    category: "raw",
  },
  { cssProp: "gap", alias: "gap", responsive: true, category: "spacing" },
  { cssProp: "rowGap", alias: "rowGap", responsive: true, category: "spacing" },
  {
    cssProp: "columnGap",
    alias: "columnGap",
    responsive: true,
    category: "spacing",
  },

  // Posicionamiento
  { cssProp: "top", alias: "top", responsive: true, category: "spacing" },
  { cssProp: "right", alias: "right", responsive: true, category: "spacing" },
  { cssProp: "bottom", alias: "bottom", responsive: true, category: "spacing" },
  { cssProp: "left", alias: "left", responsive: true, category: "spacing" },
  { cssProp: "inset", alias: "inset", responsive: true, category: "spacing" },

  // Tipografía
  {
    cssProp: "fontSize",
    alias: "fontSize",
    responsive: true,
    category: "fontSize",
  },

  // Responsive sin token — valores escalares que cambian por breakpoint
  { cssProp: "opacity", alias: "opacity", responsive: true, category: "raw" },
  { cssProp: "zIndex", alias: "zIndex", responsive: true, category: "raw" },
  { cssProp: "flexGrow", alias: "flexGrow", responsive: true, category: "raw" },
  {
    cssProp: "flexShrink",
    alias: "flexShrink",
    responsive: true,
    category: "raw",
  },
] as const satisfies readonly PropOverride<any, any, any>[];

// ─── Passthrough — CSS props sin alias, sin token resolution, sin responsive ──
const CSS_PASSTHROUGH = [
  "fontWeight",
  "textAlign",
  "whiteSpace",
  "lineHeight",
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "display",
  "flex",
  "flexWrap",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "justifyItems",
  "alignContent",
  "placeItems",
  "placeContent",
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridTemplateAreas",
  "gridColumn",
  "gridRow",
  "gridArea",
  "gridAutoColumns",
  "gridAutoRows",
  "gridAutoFlow",
  "position",
  "overflow",
  "overflowX",
  "overflowY",
  "cursor",
  "pointerEvents",
  "userSelect",
  "transition",
  "boxShadow",
  "justifyContent",
] as const;

// ─── Props excluidas del sistema ──────────────────────────────────────────────
type ExcludedProps =
  | "animation"
  | "animationName"
  | "counterReset"
  | "counterIncrement"
  | "quotes"
  | "content";

// ─── Token types — con escape hatch (string & {}) para valores arbitrarios ────
type ColorScale = BaseColors[keyof BaseColors];
export type ColorValue =
  | `${keyof BaseColors}.${keyof ColorScale}`
  | (string & {});
export type SpacingValue =
  | keyof BaseSpacing
  | "auto"
  | "full"
  | "screen"
  | "fit"
  | (string & {});
export type RadiusValue = keyof BaseRadii | (string & {});
export type FontSizeValue = keyof BaseFontSizes | (string & {});

// ─── StyleProps base — derivado automáticamente ────s───────────────────────────
type BaseStyleProps = SystemStyleProps<
  typeof STYLE_PROPS_OVERRIDES,
  ExcludedProps,
  "camel"
>;

// ─── Rich overrides — aliases con autocomplete de tokens ──────────────────────
type RichStyleProps = {
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

// ─── RawStyleProps — aliases + CSSContract, sin tokens ni Responsive ─────────
// CSSOnly<T>: reemplaza number por string — los valores en theme siempre son strings CSS
type CSSOnly<T> = T extends number ? string : T;

type AliasedRawProps = {
  [O in (typeof STYLE_PROPS_OVERRIDES)[number] as O["alias"]]?: O["cssProp"] extends (infer P extends keyof CSSProperties)[]
    ? CSSOnly<CSSProperties[P]>
    : CSSOnly<CSSProperties[O["cssProp"] & keyof CSSProperties]>;
};

type RawCSSContract = {
  [K in keyof CSSContract]?: CSSOnly<CSSContract[K]>;
};

export type RawStyleProps = Omit<RawCSSContract, keyof AliasedRawProps> &
  AliasedRawProps &
  Record<`--${string}`, string>;

// ─── StyleProps final — base + rich overrides ─────────────────────────────────
export type StyleProps = Omit<BaseStyleProps, keyof RichStyleProps> &
  RichStyleProps;

// ─── STYLE_PROPS_DATA — fuente de verdad en runtime ──────────────────────────
// Cubre aliases (con properties reales, category, responsive)
// + passthrough props (category: "raw", no responsive)
export const STYLE_PROPS_DATA: Record<string, StylePropDef> = {
  ...Object.fromEntries(
    STYLE_PROPS_OVERRIDES.map((override) => [
      override.alias,
      {
        properties: (Array.isArray(override.cssProp)
          ? [...override.cssProp]
          : [override.cssProp]) as CSSPropertyName[],
        category: override.category,
        responsive: override.responsive ?? false,
      } satisfies StylePropDef,
    ]),
  ),
  ...Object.fromEntries(
    CSS_PASSTHROUGH.map((prop) => [
      prop,
      {
        properties: [prop],
        category: "raw" as const,
        responsive: false,
      } satisfies StylePropDef,
    ]),
  ),
};

// ─── Set para O(1) lookup en extractStyleProps ────────────────────────────────
export const STYLE_PROPS_KEYS = new Set(Object.keys(STYLE_PROPS_DATA));

// ─── CSS props (camelCase) que participan en el sistema responsive ─────────────
// Usado por generateResponsive para construir el selector [data-responsive]
export const RESPONSIVE_CSS_PROPS: string[] = Array.from(
  new Set(
    STYLE_PROPS_OVERRIDES.filter((o) => o.responsive).flatMap((o) =>
      Array.isArray(o.cssProp) ? [...o.cssProp] : [o.cssProp],
    ),
  ),
);
