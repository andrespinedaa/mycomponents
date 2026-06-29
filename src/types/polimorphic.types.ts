import type { ComponentPropsWithRef, ElementType, JSX } from "react";
import type { FactoryConfig, SystemProps } from "../factory/factories.types";

export type AsProp<E extends ElementType> = {
  as?: E;
};

export type SizeProp<Config extends FactoryConfig> = {
  size?: Config["sizes"];
};

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>["ref"];

export type JSXProps<E extends ElementType> = JSX.LibraryManagedAttributes<
  E,
  React.ComponentProps<E>
>;

export type PolymorphicPropsToOmit<E extends ElementType, OwnProps = object> =
  | keyof AsProp<E>
  | keyof OwnProps
  | "ref"

export type PolymorphicOmit<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  PolymorphicPropsToOmit<E, OwnProps>
>;

export type PolymorphicProps<
  E extends ElementType,
  OwnProps = object,
> = AsProp<E> & OwnProps & PolymorphicOmit<E, OwnProps>;

export type PolymorphicComponentProps<
  E extends ElementType,
  OwnProps = object,
> = PolymorphicProps<E, OwnProps & SystemProps>;

export type PolymorphicPropsConfig<Config extends FactoryConfig> =
  PolymorphicComponentProps<Config["defaultTag"], Config["ownProps"]> & SizeProp<Config>;

/** Infiere el tipo de `HTMLElement` correspondiente al tag `E`. */
export type ElementRefType<E extends ElementType> =
  E extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[E]
    : E extends keyof SVGElementTagNameMap
    ? SVGElementTagNameMap[E]
    : HTMLElement;
