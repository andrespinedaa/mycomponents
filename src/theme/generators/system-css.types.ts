import type { CSSProperties } from "react";
import type { Prettify } from "../../utils/utils.types";
import type { CSSLength, CategoryTokens, PartialBreakPointKey } from "../core/theme.types";
import type { EXCLUDED_STYLE_PROPS, STYLE_PROPS_OVERRIDES } from "./system-css.data";

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── Types Alias StyleProps ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type Responsive<T> = T | PartialBreakPointKey<T>;
type WithTokens<T extends string> = T | CSSLength | (string & {});

// prettier-ignore
export type TokenStyleProps = {
  // ────────────────────────────────────────────────── Margin ─────────────────────────────────────────────────────────
  m?: Responsive<WithTokens<CategoryTokens["spacing"]>>;       mx?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  my?: Responsive<WithTokens<CategoryTokens["spacing"]>>;      mt?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  mr?: Responsive<WithTokens<CategoryTokens["spacing"]>>;      mb?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  ml?: Responsive<WithTokens<CategoryTokens["spacing"]>>;

  // ────────────────────────────────────────────────── Padding ────────────────────────────────────────────────────────
  p?: Responsive<WithTokens<CategoryTokens["spacing"]>>;       px?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  py?: Responsive<WithTokens<CategoryTokens["spacing"]>>;      pt?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  pr?: Responsive<WithTokens<CategoryTokens["spacing"]>>;      pb?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  pl?: Responsive<WithTokens<CategoryTokens["spacing"]>>;

  // ────────────────────────────────────────────────── Dimensions ─────────────────────────────────────────────────────
  w?: Responsive<WithTokens<CategoryTokens["spacing"]>>;       h?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  minW?: Responsive<WithTokens<CategoryTokens["spacing"]>>;    maxW?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  minH?: Responsive<WithTokens<CategoryTokens["spacing"]>>;    maxH?: Responsive<WithTokens<CategoryTokens["spacing"]>>;

  // ────────────────────────────────────────────────── Colors ─────────────────────────────────────────────────────────
  bg?: WithTokens<CategoryTokens["colors"]>;                    color?: WithTokens<CategoryTokens["colors"]>;
  borderColor?: WithTokens<CategoryTokens["colors"]>;

  // ────────────────────────────────────────────────── Radius ─────────────────────────────────────────────────────────
  rounded?: WithTokens<CategoryTokens["radius"]>;

  // ────────────────────────────────────────────────── Shadow ─────────────────────────────────────────────────────────
  shadow?: WithTokens<CategoryTokens["shadow"]>;

  // ────────────────────────────────────────────────── FlexBox ─────────────────────────────────────────────────────────
  flexDir?: Responsive<CSSProperties["flexDirection"]>;         align?: Responsive<CSSProperties["alignItems"]>;
  justify?: Responsive<CSSProperties["justifyContent"]>;        gap?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  rowGap?: Responsive<WithTokens<CategoryTokens["spacing"]>>;  columnGap?: Responsive<WithTokens<CategoryTokens["spacing"]>>;

  // ────────────────────────────────────────────────── Positions ───────────────────────────────────────────────────────
  top?: Responsive<WithTokens<CategoryTokens["spacing"]>>;     right?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  bottom?: Responsive<WithTokens<CategoryTokens["spacing"]>>;  left?: Responsive<WithTokens<CategoryTokens["spacing"]>>;
  inset?: Responsive<WithTokens<CategoryTokens["spacing"]>>;

  // ────────────────────────────────────────────────── Typography ───────────────────────────────────────────────────────
  fontSize?: Responsive<WithTokens<CategoryTokens["fontSizes"]>>;
  fontFamily?: WithTokens<CategoryTokens["font"]>;

  // ────────────────────────────────────────────────── Responsive ───────────────────────────────────────────────────────
  opacity?: Responsive<CSSProperties["opacity"]>;               zIndex?: Responsive<CSSProperties["zIndex"]>;
  flexGrow?: Responsive<CSSProperties["flexGrow"]>;             flexShrink?: Responsive<CSSProperties["flexShrink"]>;
};

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── StyleProps type ───────
// ════════════════════════════════════════════════════════════════════════════════════════

// prettier-ignore
type OverriddenRawProps =
  | "margin" | "marginLeft" | "marginRight" | "marginTop" | "marginBottom"
  | "padding" | "paddingLeft" | "paddingRight" | "paddingTop" | "paddingBottom"
  | "width" | "height" | "minWidth" | "maxWidth" | "minHeight" | "maxHeight"
  | "background" | "borderRadius" | "boxShadow"
  | "flexDirection" | "alignItems" | "justifyContent";

type ExcludedProps = (typeof EXCLUDED_STYLE_PROPS)[number];

type StylePropsPassthrough = Omit<
  CSSProperties,
  keyof TokenStyleProps | OverriddenRawProps | ExcludedProps
>;

export type StyleProps = Prettify<TokenStyleProps & StylePropsPassthrough>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── SystemCss / CSS with Tokens ───────
// ════════════════════════════════════════════════════════════════════════════════════════

type CSSPropToCategory = {
  [E in (typeof STYLE_PROPS_OVERRIDES)[keyof typeof STYLE_PROPS_OVERRIDES] as E["category"] extends "raw"
    ? never
    : E["properties"][number]
  ]: Exclude<E["category"], "raw">;
};

export type SystemCSS = {
  [K in keyof CSSProperties]?: K extends keyof CSSPropToCategory
    ? CategoryTokens[CSSPropToCategory[K]] | CSSProperties[K]
    : CSSProperties[K];
};

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── StyleProps Without Responsive ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type StylePropsTokens = {
  [K in keyof StyleProps]?: StyleProps[K] extends Responsive<infer V> ? V : StyleProps[K];
};
