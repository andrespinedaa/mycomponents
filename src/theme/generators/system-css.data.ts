import type {
  CSSMultiFormat,
  CSSPropertyName,
  ColorValue,
  ExcludedProps,
  FontSizeValue,
  PropCategory,
  PropOverride,
  RadiusValue,
  Responsive,
  RichStyleProps,
  SpacingValue,
  StylePropDef,
  SystemStyleProps,
} from "./system-css.types";
import type { BaseSpacing, Theme } from "../theme.types";
import type { CSSProperties } from "react";

// ─── STYLE_PROPS_OVERRIDES — fuente de verdad de aliases ─────────────────────
// Cada entrada define: alias del consumidor → CSS prop(s) real(es), categoría de token, soporte responsive.
// prettier-ignore
export const STYLE_PROPS_OVERRIDES = [
  // Margin
  { cssProp: "margin",                          alias: "m",           responsive: true,  category: "spacing" },
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

// ─── CSS_PASSTHROUGH — props sin alias, sin tokens, sin responsive ────────────
// prettier-ignore
const CSS_PASSTHROUGH = [
  "fontWeight", "textAlign", "whiteSpace", "lineHeight",
  "border", "borderTop", "borderRight", "borderBottom", "borderLeft",
  "display", "flex", "flexWrap", "flexBasis",
  "justifyItems", "alignContent", "placeItems", "placeContent",
  "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas",
  "gridColumn", "gridRow", "gridArea", "gridAutoColumns", "gridAutoRows", "gridAutoFlow",
  "position", "overflow", "overflowX", "overflowY",
  "cursor", "pointerEvents", "userSelect", "transition", "boxShadow", "justifyContent",
] as const;

// ─── StyleProps (consumidor) ──────────────────────────────────────────────────
// Aliases con tokens del tema + Responsive. Lo que el consumidor escribe en JSX.
// BaseStyleProps: derivado automático de STYLE_PROPS_OVERRIDES (tipos genéricos).
// RichStyleProps: override con token types específicos (SpacingValue, ColorValue...).
// StyleProps: combina ambos — RichStyleProps gana donde hay conflicto de alias.

type BaseStyleProps = SystemStyleProps<typeof STYLE_PROPS_OVERRIDES, ExcludedProps, "camel">;

export type StyleProps = Omit<BaseStyleProps, keyof RichStyleProps> & RichStyleProps;

// ─── RawStyleProps (tema interno) ────────────────────────────────────────────
// Aliases sin tokens ni Responsive — solo strings CSS puros.
// Usado en sizes y variants del theme.components (defaultProps del tema).
// CSSOnly<T>: normaliza number → string (los valores del tema siempre son strings CSS).

type CSSOnly<T> = T extends number ? string : T;

type AliasedRawProps = {
  [O in (typeof STYLE_PROPS_OVERRIDES)[number] as O["alias"]]?: O["cssProp"] extends (infer P extends keyof CSSProperties)[]
    ? CSSOnly<CSSProperties[P]>
    : CSSOnly<CSSProperties[O["cssProp"] & keyof CSSProperties]>;
};

type RawCSSMultiFormat = { [K in keyof CSSMultiFormat]?: CSSOnly<CSSMultiFormat[K]> };

export type RawStyleProps = Omit<RawCSSMultiFormat, keyof AliasedRawProps> &
  AliasedRawProps &
  Record<`--${string}`, string>;

// ─── SystemCSS — CSS properties con tokens del tema ──────────────────────────
// CSSProperties donde las propiedades con token support aceptan su token además del valor CSS.
// Mismo sistema de resolución que StyleProps pero usando los nombres CSS nativos.
// Ejemplo: style={{ padding: "md", color: "primary.500" }} — mismo DX que las styleProps.
//
// Nomenclatura del sistema:
//   SystemCSS       — el tipo (CSSProperties + tokens donde aplica)
//   StyleProp       — lo que acepta la prop `style`: SystemCSS | ((theme) => SystemCSS)
//   resolveStyle()  — resuelve tokens y la función, devuelve CSSProperties puro
//   system-css.types.ts — definiciones de tipos puros (PropCategory, PropOverride, tokens...)
//   system-css.data.ts  — runtime data: STYLE_PROPS_OVERRIDES, CSS_PROP_TO_CATEGORY, STYLE_PROPS_DATA

type CSSPropCategoryPair = {
  [I in keyof typeof STYLE_PROPS_OVERRIDES]: (typeof STYLE_PROPS_OVERRIDES)[I] extends {
    cssProp: infer P;
    category: infer C extends PropCategory;
  }
    ? P extends readonly (infer PS extends CSSPropertyName)[]
      ? { prop: PS; cat: C }
      : P extends CSSPropertyName
      ? { prop: P; cat: C }
      : never
    : never;
}[number];

type CSSPropToCategory = { [K in CSSPropCategoryPair as K["prop"]]: K["cat"] };

type CategoryToToken = {
  spacing: SpacingValue;
  color: ColorValue;
  radius: RadiusValue;
  fontSize: FontSizeValue;
  raw: "raw"; // señal para preservar CSSProperties[K] (literales como "row" | "column")
};

export type SystemCSS = {
  [K in keyof CSSProperties]?: K extends keyof CSSPropToCategory
    ? CategoryToToken[CSSPropToCategory[K] & keyof CategoryToToken] extends "raw"
      ? CSSProperties[K]
      : CategoryToToken[CSSPropToCategory[K] & keyof CategoryToToken] | CSSProperties[K]
    : CSSProperties[K];
};

// TokenStyle se mantiene como alias para compatibilidad interna
export type TokenStyle = SystemCSS;

// StyleProp — lo que acepta la prop `style` del consumidor.
// Acepta SystemCSS (objeto directo) o una función que recibe el tema y devuelve SystemCSS.
export type StyleProp = SystemCSS | ((theme: Theme) => SystemCSS);

// ─── CSS_PROP_TO_CATEGORY — lookup runtime para resolveStyle ─────────────────
// Mapea CSS property name → categoría de token. Usado por resolveStyle para saber
// cómo resolver cada valor en style={{ padding: "md", color: "primary.500" }}.
export const CSS_PROP_TO_CATEGORY: Partial<Record<string, PropCategory>> = Object.fromEntries(
  STYLE_PROPS_OVERRIDES.flatMap((o) => {
    const props = Array.isArray(o.cssProp) ? [...o.cssProp] : [o.cssProp];
    return props.map((p) => [p, o.category]);
  }),
);

// ─── STYLE_PROPS_DATA — runtime lookup ───────────────────────────────────────
// Fuente de verdad para resolución de styleProps en runtime.
// parseStyleProps lo usa para saber qué CSS properties escribir y cómo resolver el valor.

export const STYLE_PROPS_DATA: Record<string, StylePropDef> = {
  ...Object.fromEntries(
    STYLE_PROPS_OVERRIDES.map((override) => [
      override.alias,
      {
        properties: (Array.isArray(override.cssProp) ? [...override.cssProp] : [override.cssProp]) as CSSPropertyName[],
        category: override.category,
        responsive: override.responsive ?? false,
      } satisfies StylePropDef,
    ]),
  ),
  ...Object.fromEntries(
    CSS_PASSTHROUGH.map((prop) => [
      prop,
      { properties: [prop], category: "raw" as const, responsive: false } satisfies StylePropDef,
    ]),
  ),
};

// ─── STYLE_PROPS_KEYS — O(1) lookup en extractStyleProps ─────────────────────
export const STYLE_PROPS_KEYS = new Set(Object.keys(STYLE_PROPS_DATA));

// ─── RESPONSIVE_CSS_PROPS — props que participan en el sistema responsive ─────
export const RESPONSIVE_CSS_PROPS: string[] = Array.from(
  new Set(
    STYLE_PROPS_OVERRIDES.filter((o) => o.responsive).flatMap((o) =>
      Array.isArray(o.cssProp) ? [...o.cssProp] : [o.cssProp],
    ),
  ),
);

// ─── Re-exports de tipos usados en otros módulos ──────────────────────────────
export type { ColorValue, SpacingValue, RadiusValue, FontSizeValue, RichStyleProps, ExcludedProps };
export type { Responsive };
export type { BaseSpacing };
