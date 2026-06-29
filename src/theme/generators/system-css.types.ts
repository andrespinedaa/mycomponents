import type { CSSProperties } from "react";
import type { CaseFormat, Convert } from "../../types/cases.types";

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
  [K in keyof CSSProperties as Convert<
    K & string,
    "camel",  
    Format
  >]?: CSSProperties[K];
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
  | Extract<keyof CSSContract<Format>, Overrides[number]["cssProp"]>
  | Convert<Excluded & string, "camel", Format>
>;
