import type { ElementType } from "react";
import type { BuiltInMacros, ComponentVariants, Scales, StyleProps, SystemCSS, Theme, ThemeMacros } from "../../theme";
import type { PolymorphicRef } from "../../types/polimorphic.types";
import type { FactoryDefaultPropsConfig } from "./factory.defaults";
import type { FactoryFunctionOptions, FactoryRender } from "./factory.render";

export type VarsProp = Record<string, string>;
export type ModProp = Record<string, unknown> | string;
export type OrientationProp = "horizontal" | "vertical";
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;
export type StyleProp = SystemCSS | ((theme: Theme) => SystemCSS);

export type BaseProps = {
  vars?: VarsProp;
  unstyled?: boolean;
  dataSlot?: string;
  mod?: ModProp | ModProp[];
  renderRoot?: FactoryRender<FactoryRenderProps<FactoryConfig>>;
  className?: string;
  style?: StyleProp;
  children?: React.ReactNode;
  apply?: ApplyProp | ApplyProp[];
  variant?: ComponentVariants;
};

export type SystemProps = StyleProps & BaseProps;
export type FactoryStatics = Record<string, React.ComponentType<any>>;
export type EmptyStatics = Record<string, never>;

export type FactoryConfig = {
  defaultTag: ElementType;
  ownProps: object;
  sizes: Scales;
  statics: FactoryStatics;
  defaultProps: object;
  componentName: string;
};

export type ComponentConfig<Config extends FactoryConfig> = Config;

export type FactoryInternalProps<Config extends FactoryConfig> = {
  ref: PolymorphicRef<Config["defaultTag"]>;
  size: Config["sizes"] | undefined;
};

export type FactoryRenderProps<Config extends FactoryConfig> = FactoryDefaultPropsConfig<Config> &
  FactoryInternalProps<Config>;

export type ComponentFactoryOptions<Config extends FactoryConfig> = FactoryFunctionOptions<
  Config,
  FactoryRenderProps<Config>
>;
