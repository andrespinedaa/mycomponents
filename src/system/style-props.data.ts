import type { Theme } from "../theme/types";
import type { StyleProps } from "./style-props.types";

// Categoría de la prop: qué tipo de token resuelve
type PropCategory = "spacing" | "color" | "radius" | "fontSize" | "raw";

export interface StylePropDef {
  properties: string[];     // propiedades CSS que afecta (mx → marginLeft + marginRight)
  category: PropCategory;
}

export const STYLE_PROPS_DATA: Record<keyof StyleProps, StylePropDef> = {
  // — Margin —
  m:  { properties: ["margin"],                              category: "spacing" },
  mt: { properties: ["marginTop"],                           category: "spacing" },
  mr: { properties: ["marginRight"],                         category: "spacing" },
  mb: { properties: ["marginBottom"],                        category: "spacing" },
  ml: { properties: ["marginLeft"],                          category: "spacing" },
  mx: { properties: ["marginLeft", "marginRight"],           category: "spacing" },
  my: { properties: ["marginTop", "marginBottom"],           category: "spacing" },

  // — Padding —
  p:  { properties: ["padding"],                             category: "spacing" },
  pt: { properties: ["paddingTop"],                          category: "spacing" },
  pr: { properties: ["paddingRight"],                        category: "spacing" },
  pb: { properties: ["paddingBottom"],                       category: "spacing" },
  pl: { properties: ["paddingLeft"],                         category: "spacing" },
  px: { properties: ["paddingLeft", "paddingRight"],         category: "spacing" },
  py: { properties: ["paddingTop", "paddingBottom"],         category: "spacing" },

  // — Dimensiones —
  w:    { properties: ["width"],     category: "spacing" },
  h:    { properties: ["height"],    category: "spacing" },
  minW: { properties: ["minWidth"],  category: "spacing" },
  maxW: { properties: ["maxWidth"],  category: "spacing" },
  minH: { properties: ["minHeight"], category: "spacing" },
  maxH: { properties: ["maxHeight"], category: "spacing" },

  // — Colores —
  bg:          { properties: ["background"],   category: "color" },
  color:       { properties: ["color"],        category: "color" },
  borderColor: { properties: ["borderColor"],  category: "color" },

  // — Tipografía —
  fontSize:   { properties: ["fontSize"],   category: "fontSize" },
  fontWeight: { properties: ["fontWeight"], category: "raw"      },
  textAlign:  { properties: ["textAlign"],  category: "raw"      },
  whiteSpace: { properties: ["whiteSpace"], category: "raw"      },
  lineHeight: { properties: ["lineHeight"], category: "raw"      },

  // — Bordes —
  rounded:       { properties: ["borderRadius"],       category: "radius" },
  border:        { properties: ["border"],             category: "raw"    },
  borderTop:     { properties: ["borderTop"],          category: "raw"    },
  borderRight:   { properties: ["borderRight"],        category: "raw"    },
  borderBottom:  { properties: ["borderBottom"],       category: "raw"    },
  borderLeft:    { properties: ["borderLeft"],         category: "raw"    },

  // — Display y Flexbox —
  display:    { properties: ["display"],         category: "raw"     },
  flex:       { properties: ["flex"],            category: "raw"     },
  flexDir:    { properties: ["flexDirection"],   category: "raw"     },
  flexWrap:   { properties: ["flexWrap"],        category: "raw"     },
  align:      { properties: ["alignItems"],      category: "raw"     },
  justify:    { properties: ["justifyContent"],  category: "raw"     },
  gap:        { properties: ["gap"],             category: "spacing" },
  rowGap:     { properties: ["rowGap"],          category: "spacing" },
  columnGap:  { properties: ["columnGap"],       category: "spacing" },
  flexGrow:   { properties: ["flexGrow"],        category: "raw"     },
  flexShrink: { properties: ["flexShrink"],      category: "raw"     },
  flexBasis:  { properties: ["flexBasis"],       category: "spacing" },

  // — Posicionamiento —
  position: { properties: ["position"], category: "raw"     },
  top:      { properties: ["top"],      category: "spacing" },
  right:    { properties: ["right"],    category: "spacing" },
  bottom:   { properties: ["bottom"],   category: "spacing" },
  left:     { properties: ["left"],     category: "spacing" },
  zIndex:   { properties: ["zIndex"],   category: "raw"     },
  inset:    { properties: ["inset"],    category: "spacing" },

  // — Overflow y visibilidad —
  overflow:  { properties: ["overflow"],  category: "raw" },
  overflowX: { properties: ["overflowX"], category: "raw" },
  overflowY: { properties: ["overflowY"], category: "raw" },
  opacity:   { properties: ["opacity"],   category: "raw" },

  // — Miscelánea —
  cursor:        { properties: ["cursor"],        category: "raw" },
  pointerEvents: { properties: ["pointerEvents"], category: "raw" },
  userSelect:    { properties: ["userSelect"],    category: "raw" },
  transition:    { properties: ["transition"],    category: "raw" },
  boxShadow:     { properties: ["boxShadow"],     category: "raw" },
};

// ─── Set para lookup O(1) ─────────────────────────────────────────────────────
export const STYLE_PROPS_KEYS = new Set(Object.keys(STYLE_PROPS_DATA));

// ─── Resolver de tokens ───────────────────────────────────────────────────────

const SIZE_ALIASES: Record<string, string> = {
  full:   "100%",
  screen: "100vw",
  fit:    "fit-content",
  auto:   "auto",
};

export function resolveValue(
  value: string | number,
  category: PropCategory,
  theme: Theme
): string {
  const v = String(value);

  if (category === "raw") return v;

  if (category === "spacing") {
    if (v in SIZE_ALIASES) return SIZE_ALIASES[v];
    if (v in theme.spacing) {
      return `var(--${theme.cssVarPrefix}-spacing-${v})`;
    }
    return v; // escape hatch: "20px", "auto", etc.
  }

  if (category === "color") {
    // "primary.500" → var(--ui-color-primary-500)
    const match = v.match(/^([a-z]+)\.(\d+)$/);
    if (match && match[1] in theme.colors) {
      return `var(--${theme.cssVarPrefix}-color-${match[1]}-${match[2]})`;
    }
    return v; // escape hatch: "#ff0000", "rgba(...)", etc.
  }

  if (category === "radius") {
    if (v in theme.radii) {
      return `var(--${theme.cssVarPrefix}-radius-${v})`;
    }
    return v;
  }

  if (category === "fontSize") {
    if (v in theme.fontSizes) {
      return `var(--${theme.cssVarPrefix}-font-size-${v})`;
    }
    return v;
  }

  return v;
}