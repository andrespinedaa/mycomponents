import type { ElementType } from "react";
import type { ConfigProps, FactoryConfig, SystemProps } from "./factories.types";
import type {
  ElementRefType,
  JSXProps,
  PolymorphicComponentProps,
  PropsToOmit,
} from "./polimorphic.types";
import type { RequiredDefaultProps } from "./factory.defaults";
import type React from "react";

export type OverrideJsxComponentProps<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  keyof OwnProps
> &
  OwnProps;

export type MyComponentProps<E extends ElementType, OwnProps = object> = Omit<
  OverrideJsxComponentProps<E, OwnProps>,
  keyof SystemProps | PropsToOmit<E>
>;

export type FactoryRender<RenderProps extends object> = (renderProps: RenderProps) => React.ReactNode;

export type FactoryFunctionOptions<Config extends FactoryConfig, RenderProps extends object> = {
  statics?: Config["statics"];
  componentName: Config["componentName"];
  defaultProps?: RequiredDefaultProps<Config>;
  render: Config["tag"] | FactoryRender<RenderProps>;
};

export type ExistingFunctionProperties = Extract<
  "displayName" | "defaultProps" | "propTypes",
  keyof React.FunctionComponent<never>
>;

export type FactoryFunctionProperties = Pick<
  React.FunctionComponent<never>,
  ExistingFunctionProperties
>;

type StaticsOrEmpty<T> = undefined extends T ? {} : NonNullable<T>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── CONSUMER LAYER: AsProp, SystemProps (BaseProps, StyleProps), Ref, HTMLAttributes ───
// ════════════════════════════════════════════════════════════════════════════════════════

export type FactoryComponentReturn<Config extends FactoryConfig> = {
  <E extends ElementType = Config["tag"]>(
    props: PolymorphicComponentProps<E, Config["ownProps"]> &
      ConfigProps<Config> &
      React.RefAttributes<ElementRefType<E>>,
  ): React.ReactElement | null;
} & FactoryFunctionProperties &
  StaticsOrEmpty<Config["statics"]>;
