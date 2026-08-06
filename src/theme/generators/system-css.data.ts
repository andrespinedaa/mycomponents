import type { CategoryTokens, ComponentStates, CSSPropertyName } from "../core/theme.types";
import { CSS_PROPERTY_NAMES } from "./css-property-names.data";

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── DSL LENGUAGE REGEX ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export const DOLLAR_DSL = /\$(\w+)/g;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── States selectors ───────
// ════════════════════════════════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── Alias StyleProps ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type StylePropDef = {
  properties: CSSPropertyName[];
  category: keyof CategoryTokens;
  responsive: boolean;
};

// prettier-ignore
export const STYLE_PROPS_OVERRIDES = {
  // ─── Margin ──────────────────────────────
  m:           { properties: ["margin"],                       category: "spacing", responsive: true },
  mx:          { properties: ["marginLeft", "marginRight"],    category: "spacing", responsive: true },
  my:          { properties: ["marginTop", "marginBottom"],    category: "spacing", responsive: true },
  mt:          { properties: ["marginTop"],                    category: "spacing", responsive: true },
  mr:          { properties: ["marginRight"],                  category: "spacing", responsive: true },
  mb:          { properties: ["marginBottom"],                 category: "spacing", responsive: true },
  ml:          { properties: ["marginLeft"],                   category: "spacing", responsive: true },

  // ─── Padding ─────────────────────────────
  p:           { properties: ["padding"],                      category: "spacing", responsive: true },
  px:          { properties: ["paddingLeft", "paddingRight"],  category: "spacing", responsive: true },
  py:          { properties: ["paddingTop", "paddingBottom"],  category: "spacing", responsive: true },
  pt:          { properties: ["paddingTop"],                   category: "spacing", responsive: true },
  pr:          { properties: ["paddingRight"],                 category: "spacing", responsive: true },
  pb:          { properties: ["paddingBottom"],                category: "spacing", responsive: true },
  pl:          { properties: ["paddingLeft"],                  category: "spacing", responsive: true },

  // ─── Dimensiones ─────────────────────────
  w:           { properties: ["width"],                        category: "spacing", responsive: true },
  h:           { properties: ["height"],                       category: "spacing", responsive: true },
  minW:        { properties: ["minWidth"],                     category: "spacing", responsive: true },
  maxW:        { properties: ["maxWidth"],                     category: "spacing", responsive: true },
  minH:        { properties: ["minHeight"],                    category: "spacing", responsive: true },
  maxH:        { properties: ["maxHeight"],                    category: "spacing", responsive: true },

  // ─── Colores ─────────────────────────────
  bg:          { properties: ["background"],                   category: "colors", responsive: false },
  color:       { properties: ["color"],                        category: "colors", responsive: false },
  borderColor: { properties: ["borderColor"],                  category: "colors", responsive: false },

  // ─── Bordes / Shadow ─────────────────────
  rounded:     { properties: ["borderRadius"],                 category: "radius", responsive: false },
  shadow:      { properties: ["boxShadow"],                    category: "shadow", responsive: false },

  // ─── Flexbox ─────────────────────────────
  flexDir:     { properties: ["flexDirection"],                category: "raw",     responsive: true },
  align:       { properties: ["alignItems"],                   category: "raw",     responsive: true },
  justify:     { properties: ["justifyContent"],               category: "raw",     responsive: true },
  gap:         { properties: ["gap"],                          category: "spacing", responsive: true },
  rowGap:      { properties: ["rowGap"],                       category: "spacing", responsive: true },
  columnGap:   { properties: ["columnGap"],                    category: "spacing", responsive: true },

  // ─── Posicionamiento ─────────────────────
  top:         { properties: ["top"],                          category: "spacing", responsive: true },
  right:       { properties: ["right"],                        category: "spacing", responsive: true },
  bottom:      { properties: ["bottom"],                       category: "spacing", responsive: true },
  left:        { properties: ["left"],                         category: "spacing", responsive: true },
  inset:       { properties: ["inset"],                        category: "spacing", responsive: true },

  // ─── Tipografía ──────────────────────────
  fontSize:    { properties: ["fontSize"],                     category: "fontSizes", responsive: true },
  fontFamily:  { properties: ["fontFamily"],                   category: "font",      responsive: false },

  // ─── Responsive sin token ────────────────
  opacity:     { properties: ["opacity"],                      category: "raw", responsive: true },
  zIndex:      { properties: ["zIndex"],                       category: "raw", responsive: true },
  flexGrow:    { properties: ["flexGrow"],                     category: "raw", responsive: true },
  flexShrink:  { properties: ["flexShrink"],                   category: "raw", responsive: true },

} as const satisfies Record<string, StylePropDef>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── STYLEPROPS RUNTIME ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export const STYLE_PROPS_LOOKUP: Record<string, StylePropDef> = STYLE_PROPS_OVERRIDES;

type FlatStyleProp = { prop: string; category: keyof CategoryTokens; responsive: boolean };

export const STYLE_PROPS_FLAT: FlatStyleProp[] = Object.values(STYLE_PROPS_OVERRIDES).flatMap(
  (entry) =>
    entry.properties.map((prop) => ({
      prop,
      category: entry.category,
      responsive: entry.responsive,
    })),
);

const ALIASED_RAW_PROPS = new Set<string>(STYLE_PROPS_FLAT.map((entry) => entry.prop));

// prettier-ignore
export const EXCLUDED_STYLE_PROPS = [
  "animation", "animationName", "counterReset",
  "counterIncrement", "quotes", "content"
] as const;

const EXCLUDED = new Set<string>(EXCLUDED_STYLE_PROPS);

export const STYLE_PROPS_KEYS = new Set<string>([
  ...Object.keys(STYLE_PROPS_OVERRIDES),
  ...CSS_PROPERTY_NAMES.filter((name) => !ALIASED_RAW_PROPS.has(name) && !EXCLUDED.has(name)),
]);
