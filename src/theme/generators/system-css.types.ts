import type { CSSProperties } from "react";
import type { CaseFormat, ConvertFormat } from "../../types/cases.types";
import type { BreakpointKey, CSSLength, ColorValue, FontSizeValue, RadiusValue, SpacingValue } from "../theme.types";

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

// ─── STYLE_PROPS_OVERRIDES — fuente de verdad de aliases ─────────────────────
// prettier-ignore
export const STYLE_PROPS_OVERRIDES = [
  // Margin
  { cssProp: "margin",                           alias: "m",           responsive: true,  category: "spacing" },
  { cssProp: ["marginLeft", "marginRight"],      alias: "mx",          responsive: true,  category: "spacing" },
  { cssProp: ["marginTop", "marginBottom"],      alias: "my",          responsive: true,  category: "spacing" },
  { cssProp: "marginTop",                        alias: "mt",          responsive: true,  category: "spacing" },
  { cssProp: "marginRight",                      alias: "mr",          responsive: true,  category: "spacing" },
  { cssProp: "marginBottom",                     alias: "mb",          responsive: true,  category: "spacing" },
  { cssProp: "marginLeft",                       alias: "ml",          responsive: true,  category: "spacing" },

  // Padding
  { cssProp: "padding",                          alias: "p",           responsive: true,  category: "spacing" },
  { cssProp: ["paddingLeft", "paddingRight"],    alias: "px",          responsive: true,  category: "spacing" },
  { cssProp: ["paddingTop", "paddingBottom"],    alias: "py",          responsive: true,  category: "spacing" },
  { cssProp: "paddingTop",                       alias: "pt",          responsive: true,  category: "spacing" },
  { cssProp: "paddingRight",                     alias: "pr",          responsive: true,  category: "spacing" },
  { cssProp: "paddingBottom",                    alias: "pb",          responsive: true,  category: "spacing" },
  { cssProp: "paddingLeft",                      alias: "pl",          responsive: true,  category: "spacing" },

  // Dimensiones
  { cssProp: "width",                            alias: "w",           responsive: true,  category: "spacing" },
  { cssProp: "height",                           alias: "h",           responsive: true,  category: "spacing" },
  { cssProp: "minWidth",                         alias: "minW",        responsive: true,  category: "spacing" },
  { cssProp: "maxWidth",                         alias: "maxW",        responsive: true,  category: "spacing" },
  { cssProp: "minHeight",                        alias: "minH",        responsive: true,  category: "spacing" },
  { cssProp: "maxHeight",                        alias: "maxH",        responsive: true,  category: "spacing" },

  // Colores
  { cssProp: "background",                       alias: "bg",          responsive: false, category: "color"   },
  { cssProp: "color",                            alias: "color",       responsive: false, category: "color"   },
  { cssProp: "borderColor",                      alias: "borderColor", responsive: false, category: "color"   },

  // Bordes
  { cssProp: "borderRadius",                     alias: "rounded",     responsive: false, category: "radius"  },

  // Flexbox
  { cssProp: "flexDirection",                    alias: "flexDir",     responsive: true,  category: "raw"     },
  { cssProp: "alignItems",                       alias: "align",       responsive: true,  category: "raw"     },
  { cssProp: "justifyContent",                   alias: "justify",     responsive: true,  category: "raw"     },
  { cssProp: "gap",                              alias: "gap",         responsive: true,  category: "spacing" },
  { cssProp: "rowGap",                           alias: "rowGap",      responsive: true,  category: "spacing" },
  { cssProp: "columnGap",                        alias: "columnGap",   responsive: true,  category: "spacing" },

  // Posicionamiento
  { cssProp: "top",                              alias: "top",         responsive: true,  category: "spacing" },
  { cssProp: "right",                            alias: "right",       responsive: true,  category: "spacing" },
  { cssProp: "bottom",                           alias: "bottom",      responsive: true,  category: "spacing" },
  { cssProp: "left",                             alias: "left",        responsive: true,  category: "spacing" },
  { cssProp: "inset",                            alias: "inset",       responsive: true,  category: "spacing" },

  // Tipografía
  { cssProp: "fontSize",                         alias: "fontSize",    responsive: true,  category: "fontSize"},

  // Responsive sin token
  { cssProp: "opacity",                          alias: "opacity",     responsive: true,  category: "raw"     },
  { cssProp: "zIndex",                           alias: "zIndex",      responsive: true,  category: "raw"     },
  { cssProp: "flexGrow",                         alias: "flexGrow",    responsive: true,  category: "raw"     },
  { cssProp: "flexShrink",                       alias: "flexShrink",  responsive: true,  category: "raw"     },
] as const satisfies readonly PropOverride<keyof CSSProperties, string, boolean>[];

export type PartialBreakPointKey<T> = Partial<Record<BreakpointKey, T>>;
export type Responsive<T> = T | PartialBreakPointKey<T>;

// ─── StylePropDef ─────────────────────────────────────────────────────────────
export type PropCategory = "spacing" | "color" | "radius" | "fontSize" | "raw";
export type CSSPropertyName = Extract<keyof CSSProperties, string>;
export type StylePropDef = {
  properties: CSSPropertyName[];
  category: PropCategory;
  responsive: boolean;
};

// ─── CSSMultiFormat ─────────────────────────────────────────────────────────────
export type CSSMultiFormat<Format extends CaseFormat = "camel"> = {
  [K in keyof CSSProperties as ConvertFormat<K & string, "camel", Format>]?: CSSProperties[K];
};

// ─── SystemStyleProps Core ─────────────────────────────────────────────────────────
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
  CSSMultiFormat<Format>,
  | Extract<keyof CSSMultiFormat<Format>, Overrides[number]["cssProp"]>
  | ConvertFormat<Excluded & string, "camel", Format>
>;

// ─── WithTokens — preserva literales de token en autocomplete ─────────────────
export type WithTokens<T extends string> = T | CSSLength | (string & {});

// ─── TokenizedStyleProps ───────────────────────────────────────────────────────────
export type TokenizedStyleProps = {
  bg?: Responsive<WithTokens<ColorValue>>;
  color?: Responsive<WithTokens<ColorValue>>;
  borderColor?: Responsive<WithTokens<ColorValue>>;
  rounded?: Responsive<WithTokens<RadiusValue>>;
  w?: Responsive<WithTokens<SpacingValue>>;
  h?: Responsive<WithTokens<SpacingValue>>;
  minW?: Responsive<WithTokens<SpacingValue>>;
  maxW?: Responsive<WithTokens<SpacingValue>>;
  minH?: Responsive<WithTokens<SpacingValue>>;
  maxH?: Responsive<WithTokens<SpacingValue>>;
  m?: Responsive<WithTokens<SpacingValue>>;
  mx?: Responsive<WithTokens<SpacingValue>>;
  my?: Responsive<WithTokens<SpacingValue>>;
  mt?: Responsive<WithTokens<SpacingValue>>;
  mr?: Responsive<WithTokens<SpacingValue>>;
  mb?: Responsive<WithTokens<SpacingValue>>;
  ml?: Responsive<WithTokens<SpacingValue>>;
  p?: Responsive<WithTokens<SpacingValue>>;
  px?: Responsive<WithTokens<SpacingValue>>;
  py?: Responsive<WithTokens<SpacingValue>>;
  pt?: Responsive<WithTokens<SpacingValue>>;
  pr?: Responsive<WithTokens<SpacingValue>>;
  pb?: Responsive<WithTokens<SpacingValue>>;
  pl?: Responsive<WithTokens<SpacingValue>>;
  gap?: Responsive<WithTokens<SpacingValue>>;
  rowGap?: Responsive<WithTokens<SpacingValue>>;
  columnGap?: Responsive<WithTokens<SpacingValue>>;
  top?: Responsive<WithTokens<SpacingValue>>;
  right?: Responsive<WithTokens<SpacingValue>>;
  bottom?: Responsive<WithTokens<SpacingValue>>;
  left?: Responsive<WithTokens<SpacingValue>>;
  inset?: Responsive<WithTokens<SpacingValue>>;
  fontSize?: Responsive<WithTokens<FontSizeValue>>;
};

// ─── CategoryToToken — fuente de verdad: categoría → tipo de token ────────────
export type CategoryToToken = {
  spacing: SpacingValue;
  color: ColorValue;
  radius: RadiusValue;
  fontSize: FontSizeValue;
};

type ExcludedProps = "animation" | "animationName" | "counterReset" | "counterIncrement" | "quotes" | "content";
type BaseStyleProps = SystemStyleProps<typeof STYLE_PROPS_OVERRIDES, ExcludedProps, "camel">;

export type StyleProps = Omit<BaseStyleProps, keyof TokenizedStyleProps> & TokenizedStyleProps;

// ─── StylePropsTokens — StyleProps aplanados (sin Responsive) para variants/sizes/slots ──
export type StylePropsTokens = {
  [K in keyof StyleProps]?: StyleProps[K] extends Responsive<infer V> ? V : StyleProps[K];
};
