import type { ComponentPropsWithRef, ElementType, JSX } from "react";
import type {
  ConfigProps,
  FactoryConfig,
  NonPublicProps,
  SystemProps
} from "../factory/core/factories.types";

export type AsProp<E extends ElementType> = {
  as?: E;
};

export type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>["ref"];

export type JSXProps<E extends ElementType> = JSX.LibraryManagedAttributes<
  E,
  React.ComponentProps<E>
>;

export type PolymorphicPropsToOmit<E extends ElementType, OwnProps = object> =
  | keyof AsProp<E>
  | keyof OwnProps
  | "ref";

export type PolymorphicOmit<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  PolymorphicPropsToOmit<E, OwnProps>
>;

export type PolymorphicProps<E extends ElementType, OwnProps = object> = AsProp<E> &
  OwnProps &
  PolymorphicOmit<E, OwnProps>;

export type PolymorphicComponentProps<E extends ElementType, OwnProps = object> = PolymorphicProps<
  E,
  OwnProps & SystemProps
>;

// NonPublicProps (layoutCtx, hoy) es el único lugar donde esos campos son keys formalmente
// reconocidos del lado "entrante" — nunca a través de PolymorphicComponentProps/SystemProps
// (esos son la superficie pública que el consumidor tipa). Existe para que ComponentFactory
// pueda destructurarlos y descartarlos sin castear: mergedProps nace de PolymorphicPropsConfig,
// y a runtime puede traer valores filtrados desde un ancestro sin `render` propio (ver
// ComponentFactory.tsx). Para sumar un campo nuevo con esta misma protección, suscribirlo en
// NonPublicProps — no repetir un Pick acá.
export type PolymorphicPropsConfig<Config extends FactoryConfig> = PolymorphicComponentProps<
  Config["defaultTag"],
  Config["ownProps"]
> &
  ConfigProps<Config> &
  NonPublicProps<Config>;

export type ElementRefType<E extends ElementType> = E extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[E]
  : E extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[E]
  : HTMLElement;
