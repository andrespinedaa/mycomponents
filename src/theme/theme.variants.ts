import type { Responsive } from "./generators/system-css.types";
import type { RawStyleProps, StyleProps } from "./generators/system-css.data";

export type ComponentVariants =
  | "Filled"
  | "Outlined"
  | "Elevated"
  | "Ghost"
  | "Subtle"
  | "Transparent"
  | "Link"
  | "Tonal"
  | "Soft"
  | "Default"
  | "Unstyled";

export type ComponentStates =
  | "base"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "selected"
  | "checked"
  | "invalid";

// Desenvuelve Responsive<T> → T para que los tokens de variante sean valores planos
type UnwrapResponsive<T> = T extends Responsive<infer V> ? V : T;

// ─── VariantTokens — RawStyleProps + token autocomplete + escape hatch ────────
export type VariantTokens = Omit<RawStyleProps, keyof StyleProps> & {
  [K in keyof StyleProps]?: UnwrapResponsive<StyleProps[K]>;
} & Record<string, string>;

// ─── Claves dimensionales — las únicas permitidas en SizeTokens ──────────────
// Regla: sizes nunca toca visual (color, bg, border-style, shadow).
// rounded vive solo en variants — la forma es identidad visual, no dimensión.
const DIMENSION_KEYS = [
  "h", "w", "minH", "maxH", "minW", "maxW",
  "p", "px", "py", "pt", "pb", "pl", "pr",
  "m", "mx", "my", "mt", "mb", "ml", "mr",
  "fontSize", "lineHeight", "letterSpacing", "fontWeight",
  "gap", "rowGap", "columnGap",
  "borderWidth",
] as const;

type DimensionKey = (typeof DIMENSION_KEYS)[number];

// ─── SizeTokens — solo props dimensionales/estructurales ─────────────────────
export type SizeTokens = Pick<RawStyleProps, DimensionKey & keyof RawStyleProps>;

// ─── Estados ─────────────────────────────────────────────────────────────────
export type VariantStateConfig = Partial<Record<ComponentStates, VariantTokens>>;

// ─── Helper: SystemVariants<Allowed> — restringe las variantes aceptadas ─────
export type SystemVariants<Allowed extends ComponentVariants> = Allowed;
