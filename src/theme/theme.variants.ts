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

// ─── SizeTokens — RawStyleProps puro, solo valores CSS reales ────────────────
export type SizeTokens = RawStyleProps;

// ─── Estados ─────────────────────────────────────────────────────────────────
export type VariantStateConfig = Partial<Record<ComponentStates, VariantTokens>>;

// ─── Helper: SystemVariants<Allowed> — restringe las variantes aceptadas ─────
export type SystemVariants<Allowed extends ComponentVariants> = Allowed;
