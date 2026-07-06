import type { CSSProperties } from "react";
import type { CaseFormat, ConvertFormat, Prettify } from "../../types";
import type {
  PartialBreakPointKey,
  CSSLength,
  ColorValue,
  FontSizeValue,
  RadiusValue,
  SpacingValue,
} from "../core/theme.types";

// ─── CSSMultiFormat ─────────────────────────────────────────────────────────────
export type CSSMultiFormat<Format extends CaseFormat = "camel"> = {
  [K in keyof CSSProperties as ConvertFormat<K & string, "camel", Format>]?: CSSProperties[K];
};

// ─── PropOverride ─────────────────────────────────────────────────────────────
export type PropCategory = "spacing" | "color" | "radius" | "fontSize" | "raw";
export type CSSPropertyName = Extract<keyof CSSProperties, string>;
export type PropOverride<
  CSSProp extends CSSPropertyName,
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

// ─── CategoryToToken — fuente de verdad: categoría → tipo de token ────────────
export type CategoryToToken = {
  spacing: SpacingValue;
  color: ColorValue;
  radius: RadiusValue;
  fontSize: FontSizeValue;
};

// ─── StylePropDef ─────────────────────────────────────────────────────────────
export type StylePropDef = {
  properties: CSSPropertyName[];
  category: PropCategory;
  responsive: boolean;
};

// ─── TokenizedStyleProps — derivado de STYLE_PROPS_OVERRIDES + CategoryToToken ─
export type Responsive<T> = T | PartialBreakPointKey<T>;

export type TokenizedStyleProps = Prettify<{
  [O in (typeof STYLE_PROPS_OVERRIDES)[number] as O["category"] extends keyof CategoryToToken
    ? O["alias"]
    : never]?: O["responsive"] extends true
    ? Responsive<WithTokens<CategoryToToken[O["category"] & keyof CategoryToToken]>>
    : WithTokens<CategoryToToken[O["category"] & keyof CategoryToToken]>;
}>;

type ExcludedProps = "animation" | "animationName" | "counterReset" | "counterIncrement" | "quotes" | "content";
type BaseStyleProps = SystemStyleProps<typeof STYLE_PROPS_OVERRIDES, ExcludedProps, "camel">;

// ─── SystemCSS — CSS properties con tokens del tema ──────────────────────────
type CSSPropCategoryPair = {
  [I in keyof typeof STYLE_PROPS_OVERRIDES]: (typeof STYLE_PROPS_OVERRIDES)[I] extends {
    cssProp: infer P;
    category: infer C extends Exclude<PropCategory, "raw">;
  }
    ? P extends readonly (infer PS extends CSSPropertyName)[]
      ? { prop: PS; cat: C }
      : P extends CSSPropertyName
      ? { prop: P; cat: C }
      : never
    : never;
}[number];

type CSSPropToCategory = { [K in CSSPropCategoryPair as K["prop"]]: K["cat"] };

export type SystemCSS = {
  [K in keyof CSSProperties]?: K extends keyof CSSPropToCategory
    ? CategoryToToken[CSSPropToCategory[K]] | CSSProperties[K]
    : CSSProperties[K];
};

export type StyleProps = Omit<BaseStyleProps, keyof TokenizedStyleProps> & TokenizedStyleProps;

// ─── StylePropsTokens — StyleProps aplanados (sin Responsive) para variants/sizes/slots ──
export type StylePropsTokens = {
  [K in keyof StyleProps]?: StyleProps[K] extends Responsive<infer V> ? V : StyleProps[K];
};
