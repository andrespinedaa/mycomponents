import type { ComponentPropsWithRef, ElementType, JSX } from "react";

// ─── AsProp ───────────────────────────────────────────────────────────────────
// Prop Polimorfica
export type AsProp<E extends ElementType> = {
  as?: E;
};

// ─── Ref explícito ────────────────────────────────────────────────────────────
export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>["ref"];

// ─── JSXProps ───────────────────────────────────────────────────────────
// Obtiene las props del componente respetando defaultProps
// JSX.LibraryManagedAttributes marca como opcionales las props con default
export type JSXProps<E extends ElementType> = JSX.LibraryManagedAttributes<
  E,
  React.ComponentProps<E>
>;

// ─── PolymorphicProps to Omit ──────────────────────────────────────────────────────────
export type PolymorphicPropsToOmit<E extends ElementType> =
  | keyof AsProp<E>
  | "ref";

// ─── PolymorphicOmit ──────────────────────────────────────────────────────────
// Separar HTMLAttributes de OwnProps y AsProp y Ref
export type PolymorphicOmit<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  PolymorphicPropsToOmit<E> | keyof OwnProps
>;

// ─── PolymorphicProps ─────────────────────────────────────────────────────────
// Props de Componente Polimorfico
export type PolymorphicProps<
  E extends ElementType,
  OwnProps = object,
> = AsProp<E> &
  OwnProps &
  PolymorphicOmit<E, OwnProps> & { ref?: PolymorphicRef<E> };
