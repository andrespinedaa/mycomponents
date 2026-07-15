import type { ElementType } from "react";
import type { ConfigProps, FactoryConfig, SystemProps } from "./factories.types";
import type {
  ElementRefType,
  JSXProps,
  PolymorphicComponentProps,
  PolymorphicPropsToOmit,
} from "../../types/polimorphic.types";
import type { RequiredDefaultProps } from "./factory.defaults";

export type OverrideJsxComponentProps<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  keyof OwnProps
> &
  OwnProps;

export type MyComponentProps<E extends ElementType, OwnProps = object> = Omit<
  OverrideJsxComponentProps<E, OwnProps>,
  keyof SystemProps | PolymorphicPropsToOmit<E>
>;

export type FactoryRender<RenderProps extends object> = (
  renderProps: RenderProps,
) => React.ReactNode;

// `render` es polimórfico: un tag nativo (string) dispara el camino genérico (resuelve
// estilos, arma data-attributes automáticamente); una función es control total — recibe las
// props ya resueltas y decide qué renderizar (puede devolver un tag, o componer con otro
// Primitive, ej. `(props) => <Layout {...props} />`).
//
// Solo el string de Config["defaultTag"] — NO cualquier ElementType. Un ComponentClass/
// FunctionComponent pasado directo no es invocable como `resolvedTag(props)` (un class
// component necesita `new X(props).render()`, no una llamada simple); si querés componer con
// otro Primitive, envolvelo en una función: `(props) => <Layout {...props} />`.
type FactoryTag<Config extends FactoryConfig> = Config["defaultTag"] extends string
  ? Config["defaultTag"]
  : never;

export type FactoryFunctionOptions<Config extends FactoryConfig, RenderProps extends object> = {
  componentName: Config["componentName"];
  render: FactoryTag<Config> | FactoryRender<RenderProps>;
  statics?: Config["statics"];
  defaultProps?: RequiredDefaultProps<Config>;
};

export type ExistingFunctionProperties = Extract<
  "displayName" | "defaultProps" | "propTypes",
  keyof React.FunctionComponent<never>
>;

export type FactoryFunctionProperties = Pick<
  React.FunctionComponent<never>,
  ExistingFunctionProperties
>;

export type FactoryComponentReturn<Config extends FactoryConfig> = {
  <E extends ElementType = Config["defaultTag"]>(
    props: PolymorphicComponentProps<E, Config["ownProps"]> &
      ConfigProps<Config> &
      React.RefAttributes<ElementRefType<E>>,
  ): React.ReactElement | null;
} & FactoryFunctionProperties &
  (undefined extends Config["statics"] ? {} : NonNullable<Config["statics"]>);
