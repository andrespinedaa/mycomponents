import {
  STYLE_PROPS_OVERRIDES,
  type CSSPropertyName,
  type PropCategory,
  type StylePropDef,
} from "./system-css.types";

// ─── CSS_PASSTHROUGH — props sin alias, sin tokens, sin responsive ────────────
// prettier-ignore
const CSS_PASSTHROUGH = [
  "display", "flex", "flexWrap", "flexBasis",
  "position", "overflow", "overflowX", "overflowY",
  "fontWeight", "textAlign", "whiteSpace", "lineHeight",
  "justifyItems", "alignContent", "placeItems", "placeContent",
  "gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas",
  "border", "borderTop", "borderRight", "borderBottom", "borderLeft",
  "cursor", "pointerEvents", "userSelect", "transition", "boxShadow", "justifyContent",
  "gridColumn", "gridRow", "gridArea", "gridAutoColumns", "gridAutoRows", "gridAutoFlow",
  "objectFit", "objectPosition",
] as const;

// ─── CSS_PROP_TO_CATEGORY — lookup runtime para resolveStyle ─────────────────
export const CSS_PROP_TO_CATEGORY: Partial<Record<string, PropCategory>> = Object.fromEntries(
  STYLE_PROPS_OVERRIDES.flatMap((o) => {
    const props = Array.isArray(o.cssProp) ? [...o.cssProp] : [o.cssProp];
    return props.map((p) => [p, o.category]);
  }),
);

// ─── STYLE_PROPS_DATA — runtime lookup ───────────────────────────────────────
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
