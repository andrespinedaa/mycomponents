import type { StylePropsTokens } from "./generators/system-css.types";

// prettier-ignore
export type ComponentVariants =
  | "Filled" | "Outlined" | "Elevated"
  | "Ghost" | "Subtle" | "Transparent"
  | "Link" | "Tonal" | "Soft" | "Default"
  | "Unstyled";

// prettier-ignore
export type ComponentStates =
  | "base" | "hover" | "focus" | "active"
  | "disabled" | "loading" | "selected"
  | "checked" | "invalid";

// ─── Estados ─────────────────────────────────────────────────────────────────
export type VariantStates = Partial<Record<ComponentStates, StylePropsTokens>>;

// ─── Helper: SystemVariants<Allowed> — restringe las variantes aceptadas ─────
export type SystemVariants<Allowed extends ComponentVariants> = Allowed;
