import type { CSSProperties, ElementType } from "react";
import type { StyleProps } from "../theme/generators/system-css.data";
import type {
  ElementRefType,
  JSXProps,
  PolymorphicComponentProps,
  PolymorphicPropsConfig,
  PolymorphicPropsToOmit,
  PolymorphicRef,
  SizeProp,
} from "../types/polimorphic.types";
import type { ComponentVariants } from "../theme/theme.variants";
import type { defaultThemeMacros } from "../theme/theme.macros.data";
import type { BuiltInMacros } from "../theme/theme.macros.types";
import type { ResolvedFactoryProps } from "../hooks/useResolveProps";
import type { Theme } from "../theme/theme.types";

export type ModProp = Record<string, unknown> | string;
export type VarsProp = Record<string, string>;
export type ThemeMacros = typeof defaultThemeMacros;
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;
export type OrientationProp = "horizontal" | "vertical";

export type BaseProps = {
  vars?: VarsProp;
  unstyled?: boolean;
  dataSlot?: string;
  mod?: ModProp | ModProp[];
  renderRoot?: FactoryRender<Record<string, unknown>>;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  apply?: ApplyProp | ApplyProp[];
  variant?: ComponentVariants;
  /** @internal Inyectado por ComponentFactory — filtrado antes del DOM. */
  theme?: unknown;
  /** @internal Inyectado por ComponentFactory — filtrado antes del DOM. */
  hooks?: unknown;
};

export type SystemProps = StyleProps & BaseProps;

export type OverrideJsxComponentProps<
  E extends ElementType,
  OwnProps = object,
> = Omit<JSXProps<E>, keyof OwnProps> & OwnProps;

export type MyComponentProps<E extends ElementType, OwnProps = object> = Omit<
  OverrideJsxComponentProps<E, OwnProps>,
  keyof SystemProps | PolymorphicPropsToOmit<E>
>;

export type FactoryStatics = Record<string, React.ComponentType<any>>;
export type EmptyStatics = Record<string, never>;
export type EmptyOwnProps = Record<string, never>;

export type ExistingFunctionComponentKeys = Extract<
  "displayName" | "defaultProps" | "propTypes",
  keyof React.FunctionComponent<never>
>;

export type ComponentProperties = Pick<
  React.FunctionComponent<never>,
  ExistingFunctionComponentKeys
>;

export type FactoryConfig = {
  defaultTag: ElementType;
  ownProps: object;
  sizes?: string;
  statics?: FactoryStatics;
  defaultProps?: object;
  componentName?: string;
  hooks?: object;
};

export type HooksOf<Config extends FactoryConfig> = Config extends {
  hooks: infer H extends object;
}
  ? H
  : Record<never, never>;

export type ComponentConfig<Config extends FactoryConfig> = Config;

export type DefaultableProps<Config extends FactoryConfig> = Partial<
  Config["ownProps"] & PolymorphicPropsConfig<Config>
>;

export type DefaultsPropKeys<Config extends FactoryConfig> = Extract<
  keyof DefaultableProps<Config>,
  keyof NonNullable<Config["defaultProps"]>
>;

export type RequiredDefaultProps<Config extends FactoryConfig> = Required<
  Pick<DefaultableProps<Config>, DefaultsPropKeys<Config>>
> &
  Partial<Omit<DefaultableProps<Config>, DefaultsPropKeys<Config>>>;

export type DefaultProps<Props, Defaults> = Omit<Props, keyof Defaults> &
  Required<Pick<Props, keyof Defaults & keyof Props>>;

export type DefaultPropsConfig<Config extends FactoryConfig> = DefaultProps<
  ResolvedFactoryProps<Config>,
  NonNullable<Config["defaultProps"]>
>;

export type BaseRenderProps<Config extends FactoryConfig> =
  DefaultPropsConfig<Config> & {
    ref: PolymorphicRef<Config["defaultTag"]>;
    theme: Theme;
    hooks: HooksOf<Config>;
    size?: Config["sizes"];
  };

export type FactoryRender<RenderProps extends object> = (
  renderProps: RenderProps,
) => React.ReactNode;

export type FactoryOptions<
  Config extends FactoryConfig,
  RenderProps extends object,
> = {
  componentName?: Config["componentName"];
  defaultTag: Config["defaultTag"];
  render?: FactoryRender<RenderProps>;
  statics?: Config["statics"];
  defaultProps?: RequiredDefaultProps<Config>;
  useHooks?: () => HooksOf<Config>;
};

export type FactoryComponentReturn<Config extends FactoryConfig> = {
  <E extends ElementType = Config["defaultTag"]>(
    props: PolymorphicComponentProps<E, Config["ownProps"] & SizeProp<Config>> &
      React.RefAttributes<ElementRefType<E>>,
  ): React.ReactElement | null;
} & ComponentProperties &
  Config["statics"];
