import type { CSSProperties } from "react";
import type { CaseFormat, ConvertFormat } from "../../types/cases.types";
import type { BreakpointKey, ColorValue, FontSizeValue, RadiusValue, SpacingValue, BaseBreakPoints } from "../theme.types";

// ─── Responsive ───────────────────────────────────────────────────────────────
export const BREAKPOINT_KEYS = ["base", "sm", "md", "lg", "xl"] as const satisfies BreakpointKey[];
// prettier-ignore
export const DIMENSION_KEYS = [
  "h", "w", "minH", "maxH", "minW", "maxW",
  "p", "px", "py", "pt", "pb", "pl", "pr",
  "m", "mx", "my", "mt", "mb", "ml", "mr",
  "fontSize", "lineHeight", "letterSpacing",
  "fontWeight", "gap", "rowGap", "columnGap",
  "borderWidth",
] as const;
export type DimensionKey = (typeof DIMENSION_KEYS)[number];
export type PartialBreakPointKey<T> = Partial<Record<BreakpointKey, T>>;
export type Responsive<T> = T | PartialBreakPointKey<T>;
export type { BreakpointKey, BaseBreakPoints };

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
  CSSMultiFormat<Format>,
  | Extract<keyof CSSMultiFormat<Format>, Overrides[number]["cssProp"]>
  | ConvertFormat<Excluded & string, "camel", Format>
>;

// ─── ExcludedProps ────────────────────────────────────────────────────────────
export type ExcludedProps = "animation" | "animationName" | "counterReset" | "counterIncrement" | "quotes" | "content";

// ─── RichStyleProps ───────────────────────────────────────────────────────────
export type RichStyleProps = {
  bg?: Responsive<ColorValue | CSSProperties["background"]>;
  color?: Responsive<ColorValue | CSSProperties["color"]>;
  borderColor?: Responsive<ColorValue | CSSProperties["borderColor"]>;
  rounded?: Responsive<RadiusValue | CSSProperties["borderRadius"]>;
  w?: Responsive<SpacingValue | CSSProperties["width"]>;
  h?: Responsive<SpacingValue | CSSProperties["height"]>;
  minW?: Responsive<SpacingValue | CSSProperties["minWidth"]>;
  maxW?: Responsive<SpacingValue | CSSProperties["maxWidth"]>;
  minH?: Responsive<SpacingValue | CSSProperties["minHeight"]>;
  maxH?: Responsive<SpacingValue | CSSProperties["maxHeight"]>;
  m?: Responsive<SpacingValue | CSSProperties["margin"]>;
  mx?: Responsive<SpacingValue | CSSProperties["marginLeft"]>;
  my?: Responsive<SpacingValue | CSSProperties["marginTop"]>;
  mt?: Responsive<SpacingValue | CSSProperties["marginTop"]>;
  mr?: Responsive<SpacingValue | CSSProperties["marginRight"]>;
  mb?: Responsive<SpacingValue | CSSProperties["marginBottom"]>;
  ml?: Responsive<SpacingValue | CSSProperties["marginLeft"]>;
  p?: Responsive<SpacingValue | CSSProperties["padding"]>;
  px?: Responsive<SpacingValue | CSSProperties["paddingLeft"]>;
  py?: Responsive<SpacingValue | CSSProperties["paddingTop"]>;
  pt?: Responsive<SpacingValue | CSSProperties["paddingTop"]>;
  pr?: Responsive<SpacingValue | CSSProperties["paddingRight"]>;
  pb?: Responsive<SpacingValue | CSSProperties["paddingBottom"]>;
  pl?: Responsive<SpacingValue | CSSProperties["paddingLeft"]>;
  gap?: Responsive<SpacingValue | CSSProperties["gap"]>;
  rowGap?: Responsive<SpacingValue | CSSProperties["rowGap"]>;
  columnGap?: Responsive<SpacingValue | CSSProperties["columnGap"]>;
  top?: Responsive<SpacingValue | CSSProperties["top"]>;
  right?: Responsive<SpacingValue | CSSProperties["right"]>;
  bottom?: Responsive<SpacingValue | CSSProperties["bottom"]>;
  left?: Responsive<SpacingValue | CSSProperties["left"]>;
  inset?: Responsive<SpacingValue | CSSProperties["inset"]>;
  fontSize?: Responsive<FontSizeValue | CSSProperties["fontSize"]>;
};
