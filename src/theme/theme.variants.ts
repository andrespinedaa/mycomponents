import type { Responsive } from "./generators/system-css.types";
import type { StyleProps } from "./generators/system-css.data";

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

// Desenvuelve Responsive<T> → T para que los tokens de variante sean valores planos
type UnwrapResponsive<T> = T extends Responsive<infer V> ? V : T;

// ─── Tokens de variante — StyleProps sin Responsive + escape hatch para CSS puro
export type VariantTokens = {
  [K in keyof StyleProps]?: UnwrapResponsive<StyleProps[K]>;
} & Record<string, string>;

// ─── Estados ─────────────────────────────────────────────────────────────────
export type VariantStateConfig = {
  base?: VariantTokens;
  hover?: VariantTokens;
  focus?: VariantTokens;
  active?: VariantTokens;
  disabled?: VariantTokens;
  loading?: VariantTokens;
  selected?: VariantTokens;
  checked?: VariantTokens;
  invalid?: VariantTokens;
};

// ─── Helper: Variant<Allowed> — restringe las variantes aceptadas ─────────────
export type Variant<Allowed extends ComponentVariants> = Allowed;
