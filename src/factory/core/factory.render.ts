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

export type FactoryFunctionOptions<Config extends FactoryConfig, RenderProps extends object> = {
  componentName: Config["componentName"];
  defaultTag: Config["defaultTag"];
  render?: FactoryRender<RenderProps>;
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
