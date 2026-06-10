import type { Theme } from "../theme/types";
import type { CSSProperties } from "react";

// ─── Helpers de tipo ──────────────────────────────────────────────────────────

// Un valor puede ser un token del tema O un valor CSS arbitrario (escape hatch)
type TokenOrValue<Token extends string> = Token | (string & {});

// Responsive: un valor solo, o un objeto por breakpoint
type Responsive<T> = T | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", T>>;

// ─── Tokens del tema ──────────────────────────────────────────────────────────

type SpacingToken = keyof Theme["spacing"];       // "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
type ColorToken = `${keyof Theme["colors"]}.${keyof Theme["colors"][keyof Theme["colors"]]}`;
// "primary.500" | "neutral.100" | "danger.700" ...
type RadiusToken = keyof Theme["radii"];          // "none" | "sm" | "md" | "lg" | "full"
type FontSizeToken = keyof Theme["fontSizes"];    // "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

// ─── Valores de spacing con escape hatch ─────────────────────────────────────
type SpacingValue = TokenOrValue<SpacingToken>;
type ColorValue   = TokenOrValue<ColorToken>;
type RadiusValue  = TokenOrValue<RadiusToken>;
type FontSizeValue = TokenOrValue<FontSizeToken>;

// ─── Valores CSS puros (no tienen tokens) ─────────────────────────────────────
type DisplayValue    = CSSProperties["display"];
type FlexValue       = CSSProperties["flex"];
type AlignValue      = CSSProperties["alignItems"];
type JustifyValue    = CSSProperties["justifyContent"];
type FlexDirValue    = CSSProperties["flexDirection"];
type FlexWrapValue   = CSSProperties["flexWrap"];
type PositionValue   = CSSProperties["position"];
type OverflowValue   = CSSProperties["overflow"];
type CursorValue     = CSSProperties["cursor"];
type TextAlignValue  = CSSProperties["textAlign"];
type FontWeightValue = CSSProperties["fontWeight"];
type WhiteSpaceValue = CSSProperties["whiteSpace"];

// ─── Las Style Props ──────────────────────────────────────────────────────────

export interface StyleProps {
  // — Margin —
  m?:  Responsive<SpacingValue>;
  mt?: Responsive<SpacingValue>;
  mr?: Responsive<SpacingValue>;
  mb?: Responsive<SpacingValue>;
  ml?: Responsive<SpacingValue>;
  mx?: Responsive<SpacingValue>;
  my?: Responsive<SpacingValue>;

  // — Padding —
  p?:  Responsive<SpacingValue>;
  pt?: Responsive<SpacingValue>;
  pr?: Responsive<SpacingValue>;
  pb?: Responsive<SpacingValue>;
  pl?: Responsive<SpacingValue>;
  px?: Responsive<SpacingValue>;
  py?: Responsive<SpacingValue>;

  // — Dimensiones —
  w?:   Responsive<SpacingValue | "auto" | "full" | "screen" | "fit">;
  h?:   Responsive<SpacingValue | "auto" | "full" | "screen" | "fit">;
  minW?: Responsive<SpacingValue | "auto" | "full">;
  maxW?: Responsive<SpacingValue | "auto" | "full">;
  minH?: Responsive<SpacingValue | "auto" | "full">;
  maxH?: Responsive<SpacingValue | "auto" | "full">;

  // — Colores —
  bg?:    Responsive<ColorValue>;
  color?: Responsive<ColorValue>;
  borderColor?: Responsive<ColorValue>;

  // — Tipografía —
  fontSize?:   Responsive<FontSizeValue>;
  fontWeight?: Responsive<FontWeightValue>;
  textAlign?:  Responsive<TextAlignValue>;
  whiteSpace?: Responsive<WhiteSpaceValue>;
  lineHeight?: Responsive<string | number>;

  // — Bordes —
  rounded?:       Responsive<RadiusValue>;
  border?:        Responsive<string>;
  borderTop?:     Responsive<string>;
  borderRight?:   Responsive<string>;
  borderBottom?:  Responsive<string>;
  borderLeft?:    Responsive<string>;

  // — Display y Flexbox —
  display?:        Responsive<DisplayValue>;
  flex?:           Responsive<FlexValue>;
  flexDir?:        Responsive<FlexDirValue>;
  flexWrap?:       Responsive<FlexWrapValue>;
  align?:          Responsive<AlignValue>;
  justify?:        Responsive<JustifyValue>;
  gap?:            Responsive<SpacingValue>;
  rowGap?:         Responsive<SpacingValue>;
  columnGap?:      Responsive<SpacingValue>;
  flexGrow?:       Responsive<number | string>;
  flexShrink?:     Responsive<number | string>;
  flexBasis?:      Responsive<SpacingValue>;

  // — Posicionamiento —
  position?: Responsive<PositionValue>;
  top?:      Responsive<SpacingValue | "auto">;
  right?:    Responsive<SpacingValue | "auto">;
  bottom?:   Responsive<SpacingValue | "auto">;
  left?:     Responsive<SpacingValue | "auto">;
  zIndex?:   Responsive<number | string>;
  inset?:    Responsive<SpacingValue | "auto">;

  // — Overflow y visibilidad —
  overflow?:  Responsive<OverflowValue>;
  overflowX?: Responsive<OverflowValue>;
  overflowY?: Responsive<OverflowValue>;
  opacity?:   Responsive<number | string>;

  // — Miscelánea —
  cursor?:        Responsive<CursorValue>;
  pointerEvents?: Responsive<CSSProperties["pointerEvents"]>;
  userSelect?:    Responsive<CSSProperties["userSelect"]>;
  transition?:    Responsive<string>;
  boxShadow?:     Responsive<string>;
}