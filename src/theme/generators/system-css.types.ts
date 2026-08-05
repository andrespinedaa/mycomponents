import type { CSSProperties } from "react";
import type { Prettify } from "../../utils/utils.types";
import type {
  PartialBreakPointKey,
  CSSLength,
  ColorsValue,
  FontSizesValue,
  FontValue,
  RadiusValue,
  SpacingValue,
  ShadowValue,
  CategoryTokens,
  ComponentStates,
} from "../core/theme.types";

// ─── PropOverride ─────────────────────────────────────────────────────────────
export type CSSPropertyName = Extract<keyof CSSProperties, string>;
export type PropOverride<
  CSSProp extends CSSPropertyName,
  Alias extends string,
  IsResponsive extends boolean = false,
> = {
  cssProp: CSSProp | CSSProp[];
  alias: Alias;
  responsive?: IsResponsive;
  category: CategoryTokens;
};

// prettier-ignore
export const STATE_SELECTORS: Record<ComponentStates, string> = {
  hover:      ":hover",           focus:        ":focus",             focusVisible: ":focus-visible",
  focusWithin:":focus-within",    active:       ":active",            disabled:     "[data-disabled]",
  checked:    ":checked",         indeterminate:":indeterminate",     required:     ":required",
  invalid:    "[data-invalid]",   valid:        ":valid",             readOnly:     ":read-only",
  placeholder:"::placeholder",    autofill:     ":-webkit-autofill",  loading:      "[data-loading]",
  selected:   "[data-selected]",  before:       "::before",           after:        "::after",
  marker:     "::marker",         firstChild:   ":first-child",       lastChild:    ":last-child",
  empty:      ":empty",           selection:    "::selection",
};

// ─── CSS_PASSTHROUGH — props sin alias, sin tokens, sin responsive ────────────
// prettier-ignore
export const CSS_PASSTHROUGH = [
  "display", "flex", "flexWrap", "flexBasis", "position", "overflow", "overflowX", "overflowY",
  "fontWeight", "textAlign", "whiteSpace", "lineHeight", "justifyItems", "alignContent", "placeItems",
  "placeContent", "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas","border", "borderTop", 
  "borderRight", "borderBottom", "borderLeft", "cursor", "pointerEvents", "userSelect", "transition",
  "justifyContent", "gridColumn", "gridRow", "gridArea", "gridAutoColumns", "gridAutoRows",
  "gridAutoFlow", "objectFit", "objectPosition",
] as const;

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
  { cssProp: "background",                       alias: "bg",          responsive: false, category: "colors"  },
  { cssProp: "color",                            alias: "color",       responsive: false, category: "colors"  },
  { cssProp: "borderColor",                      alias: "borderColor", responsive: false, category: "colors"  },

  // Bordes
  { cssProp: "borderRadius",                     alias: "rounded",     responsive: false, category: "radius"  },

  // Shadows
  { cssProp: "boxShadow",                        alias: "shadow",      responsive: false, category: "shadow"  },

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
  { cssProp: "fontSize",                         alias: "fontSize",    responsive: true,  category: "fontSizes"},
  { cssProp: "fontFamily",                       alias: "fontFamily",  responsive: false, category: "font"    },

  // Responsive sin token
  { cssProp: "opacity",                          alias: "opacity",     responsive: true,  category: "raw"     },
  { cssProp: "zIndex",                           alias: "zIndex",      responsive: true,  category: "raw"     },
  { cssProp: "flexGrow",                         alias: "flexGrow",    responsive: true,  category: "raw"     },
  { cssProp: "flexShrink",                       alias: "flexShrink",  responsive: true,  category: "raw"     },
  
] as const satisfies readonly PropOverride<keyof CSSProperties, string, boolean>[];

// ─── WithTokens — preserva literales de token en autocomplete ─────────────────
export type WithTokens<T extends string> = T | CSSLength | (string & {});

// ─── CategoryToToken — fuente de verdad: categoría → tipo de token ────────────
export type CategoryToToken = {
  font: FontValue;
  color: ColorsValue;
  shadow: ShadowValue;
  radius: RadiusValue;
  spacing: SpacingValue;
  fontSize: FontSizesValue;
};

// ─── StylePropDef ─────────────────────────────────────────────────────────────
export type StylePropDef = {
  properties: CSSPropertyName[];
  category: CategoryTokens;
  responsive: boolean;
};

export type Responsive<T> = T | PartialBreakPointKey<T>;

// ─── TokenStyleProps ─
// prettier-ignore
export type TokenStyleProps = {
  // ─── margin ──────────────────────────────
  m?: Responsive<WithTokens<CategoryToToken["spacing"]>>;       mx?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  my?: Responsive<WithTokens<CategoryToToken["spacing"]>>;      mt?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  mr?: Responsive<WithTokens<CategoryToToken["spacing"]>>;      mb?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  ml?: Responsive<WithTokens<CategoryToToken["spacing"]>>;

  // ─── padding ─────────────────────────────
  p?: Responsive<WithTokens<CategoryToToken["spacing"]>>;       px?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  py?: Responsive<WithTokens<CategoryToToken["spacing"]>>;      pt?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  pr?: Responsive<WithTokens<CategoryToToken["spacing"]>>;      pb?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  pl?: Responsive<WithTokens<CategoryToToken["spacing"]>>;

  // ─── dimensiones ─────────────────────────
  w?: Responsive<WithTokens<CategoryToToken["spacing"]>>;       h?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  minW?: Responsive<WithTokens<CategoryToToken["spacing"]>>;    maxW?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  minH?: Responsive<WithTokens<CategoryToToken["spacing"]>>;    maxH?: Responsive<WithTokens<CategoryToToken["spacing"]>>;

  // ─── colores ─────────────────────────────
  bg?: WithTokens<CategoryToToken["color"]>;                    color?: WithTokens<CategoryToToken["color"]>;
  borderColor?: WithTokens<CategoryToToken["color"]>;

  // ─── bordes ──────────────────────────────
  rounded?: WithTokens<CategoryToToken["radius"]>;

  // ─── shadows ─────────────────────────────
  shadow?: WithTokens<CategoryToToken["shadow"]>;

  // ─── flexbox ─────────────────────────────
  flexDir?: Responsive<CSSProperties["flexDirection"]>;         align?: Responsive<CSSProperties["alignItems"]>;
  justify?: Responsive<CSSProperties["justifyContent"]>;        gap?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  rowGap?: Responsive<WithTokens<CategoryToToken["spacing"]>>;  columnGap?: Responsive<WithTokens<CategoryToToken["spacing"]>>;

  // ─── posicionamiento ─────────────────────
  top?: Responsive<WithTokens<CategoryToToken["spacing"]>>;     right?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  bottom?: Responsive<WithTokens<CategoryToToken["spacing"]>>;  left?: Responsive<WithTokens<CategoryToToken["spacing"]>>;
  inset?: Responsive<WithTokens<CategoryToToken["spacing"]>>;

  // ─── tipografía ──────────────────────────
  fontSize?: Responsive<WithTokens<CategoryToToken["fontSize"]>>;
  fontFamily?: WithTokens<CategoryToToken["font"]>;

  // ─── responsive sin token ────────────────
  opacity?: Responsive<CSSProperties["opacity"]>;               zIndex?: Responsive<CSSProperties["zIndex"]>;
  flexGrow?: Responsive<CSSProperties["flexGrow"]>;             flexShrink?: Responsive<CSSProperties["flexShrink"]>;
};

// prettier-ignore
type OverriddenRawProps =
  | "margin" | "marginLeft" | "marginRight" | "marginTop" | "marginBottom"
  | "padding" | "paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom"
  | "width" | "height" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight"
  | "background" | "borderRadius" | "boxShadow"
  | "flexDirection" | "alignItems" | "justifyContent";

// ─── StylePropsPassthrough — CSSProperties crudo, sin tokens ni alias ─────────
type StylePropsPassthrough = Omit<
  CSSProperties,
  keyof TokenStyleProps | OverriddenRawProps | ExcludedProps
>;

type ExcludedProps =
  "animation" | "animationName" | "counterReset" | "counterIncrement" | "quotes" | "content";

// ─── SystemCSS — CSS properties con tokens del tema ──────────────────────────
type CSSCategoryTokensPair = {
  [I in keyof typeof STYLE_PROPS_OVERRIDES]: (typeof STYLE_PROPS_OVERRIDES)[I] extends {
    cssProp: infer P;
    category: infer C extends Exclude<CategoryTokens, "raw">;
  }
    ? P extends readonly (infer PS extends CSSPropertyName)[]
      ? { prop: PS; cat: C }
      : P extends CSSPropertyName
        ? { prop: P; cat: C }
        : never
    : never;
}[number];

type CSSPropToCategory = { [K in CSSCategoryTokensPair as K["prop"]]: K["cat"] };

export type SystemCSS = {
  [K in keyof CSSProperties]?: K extends keyof CSSPropToCategory
    ? CategoryToToken[CSSPropToCategory[K]] | CSSProperties[K]
    : CSSProperties[K];
};

export type StyleProps = Prettify<TokenStyleProps & StylePropsPassthrough>;

// ─── StylePropsTokens — StyleProps aplanados (sin Responsive) para variants/sizes/slots ──
export type StylePropsTokens = {
  [K in keyof StyleProps]?: StyleProps[K] extends Responsive<infer V> ? V : StyleProps[K];
};
