import type { ElementType, JSX } from "react";
import type { ConfigProps, FactoryConfig, NonPublicProps, SystemProps } from "./factories.types";

export type AsProp<E extends ElementType> = {
  as?: E;
};

export type JSXProps<E extends ElementType> = JSX.LibraryManagedAttributes<
  E,
  React.ComponentProps<E>
>;

export type PropsToOmit<E extends ElementType, OwnProps = object> =
  | keyof AsProp<E>
  | keyof OwnProps
  | "ref";

export type PolymorphicOmit<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  PropsToOmit<E, OwnProps>
>;

export type PolymorphicProps<E extends ElementType, OwnProps = object> = AsProp<E> &
  OwnProps &
  PolymorphicOmit<E, OwnProps>;

export type PolymorphicComponentProps<E extends ElementType, OwnProps = object> = PolymorphicProps<
  E,
  OwnProps & SystemProps
>;

export type PolymorphicPropsConfig<Config extends FactoryConfig> = PolymorphicComponentProps<
  Config["tag"],
  Config["ownProps"]
> &
  ConfigProps<Config> &
  NonPublicProps<Config>;

export type ElementRefType<E extends ElementType> = E extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[E]
  : E extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[E]
  : HTMLElement;
