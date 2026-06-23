import type { ComponentPropsWithRef, ElementType, JSX } from "react";
import type { FactoryConfig, SystemProps } from "../factory/factories.types";

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
export type PolymorphicPropsToOmit<E extends ElementType, Aditional = object> =
  | keyof AsProp<E>
  | keyof Aditional
  | "ref";

// ─── PolymorphicOmit ──────────────────────────────────────────────────────────
// Separar HTMLAttributes de OwnProps y AsProp y Ref
export type PolymorphicOmit<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  PolymorphicPropsToOmit<E, OwnProps>
>;

// ─── PolymorphicProps ─────────────────────────────────────────────────────────
export type PolymorphicProps<
  E extends ElementType,
  OwnProps = object,
> = AsProp<E> & OwnProps & PolymorphicOmit<E, OwnProps>;

// ─── Polymorphic Component Props ──────────────────────────────────────────────────────────
export type PolymorphicComponentProps<
  E extends ElementType,
  OwnProps = object,
> = PolymorphicProps<E, OwnProps & SystemProps>;

export type PolymorphicPropsConfig<Config extends FactoryConfig> =
  PolymorphicComponentProps<Config["defaultTag"], Config["ownProps"]>;

export type ElementRefType<E extends ElementType> =
  E extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[E] // "div" → HTMLDivElement
    : E extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[E] // "svg" → SVGSVGElement
    : HTMLElement; // fallback
