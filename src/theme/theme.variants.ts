import type { RawStyleProps, StyleProps } from "./generators/system-css.data";
import type { DimensionKey, Responsive } from "./generators/system-css.types";

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

// ─── SizeTokens — solo props dimensionales/estructurales, con soporte de tokens ─
type StylePropsTokenOnly = {
  [K in keyof StyleProps]?: UnwrapResponsive<StyleProps[K]>;
};
export type SizeTokens = Pick<StylePropsTokenOnly, DimensionKey & keyof StylePropsTokenOnly>;

// ─── SlotTokens — estilos estáticos por slot (sin estados interactivos) ──────
// Misma forma que VariantTokens pero sin hover/focus/active/disabled.
// Se usa en ThemeComponentOptions.slots para componentes compound.
export type SlotTokens = VariantTokens;

// ─── Estados ─────────────────────────────────────────────────────────────────
export type VariantStateConfig = Partial<Record<ComponentStates, VariantTokens>>;

// ─── Helper: SystemVariants<Allowed> — restringe las variantes aceptadas ─────
export type SystemVariants<Allowed extends ComponentVariants> = Allowed;
