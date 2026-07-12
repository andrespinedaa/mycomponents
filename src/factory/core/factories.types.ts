import type { ElementType } from "react";
import type { ModProps } from "../../system/get-mod";
import type {
  BuiltInMacros,
  ComponentVariants,
  Scales,
  StyleProps,
  SystemCSS,
  Theme,
  ThemeMacros,
} from "../../theme";
import type { PolymorphicRef } from "../../types/polimorphic.types";
import type { DefaultProps, FactoryDefaultPropsConfig } from "./factory.defaults";
import type { FactoryFunctionOptions } from "./factory.render";

export type VarsProp = Record<string, string>;
export type ModProp = Record<string, unknown> | string;
export type OrientationProp = "horizontal" | "vertical";
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;
export type StyleProp = SystemCSS | ((theme: Theme) => SystemCSS);

export type BaseProps = {
  "data-slot"?: string;
  vars?: VarsProp;
  unstyled?: boolean;
  dataSlot?: string;
  mod?: ModProp | ModProp[];
  className?: string;
  style?: StyleProp;
  children?: React.ReactNode;
  apply?: ApplyProp | ApplyProp[];
};

export type SystemProps = StyleProps & BaseProps;
export type FactoryStatics = Record<string, React.ComponentType<any>>;
export type EmptyStatics = Record<string, never>;

export type FactoryConfig = {
  sizes: Scales;
  ownProps: object;
  presets?: string;
  sections?: Record<string, object>;
  defaultProps: object;
  componentName: string;
  statics: FactoryStatics;
  defaultTag: ElementType;
  variants: ComponentVariants;
};

// ─── Props que necesitan Config ──────────────────────────────────────────────────────────
export type SizeProp<Config extends FactoryConfig> = {
  size?: Config["sizes"];
};

export type PresetProp<Config extends FactoryConfig> = {
  preset?: Config["presets"];
};

export type SectionProp<Config extends FactoryConfig> = {
  section?: Unpack<Config["sections"]>;
};

export type VariantProp<Config extends FactoryConfig> = {
  variant?: Config["variants"];
};

// Props que renderRoot recibe — element-agnosticas para poder spreadearse en cualquier elemento.
export type RenderRootPayload<Config extends FactoryConfig> =
  Omit<React.HTMLAttributes<HTMLElement>, "translate"> &
  ModProps &
  Config["ownProps"] &
  SizeProp<Config> &
  PresetProp<Config> &
  SectionProp<Config> &
  VariantProp<Config> & {
    ref?: React.Ref<any>;
    vars?: VarsProp;
  };

export type RenderRootProp<Config extends FactoryConfig> = {
  renderRoot?: (props: RenderRootPayload<Config>) => React.ReactNode;
};

export type ConfigProps<Config extends FactoryConfig> = SizeProp<Config> &
  PresetProp<Config> &
  SectionProp<Config> &
  VariantProp<Config> &
  RenderRootProp<Config>;

export type ComponentConfig<Config extends FactoryConfig> = Config;

type Unpack<T> = T extends string
  ? T
  : T extends Record<string, object>
    ? keyof T
    : undefined;

type InternalRawProps<Config extends FactoryConfig> = {
  ref: PolymorphicRef<Config["defaultTag"]>;
  size?: Config["sizes"];
  preset?: Unpack<Config["presets"]>;
  section?: Unpack<Config["sections"]>;
  variant?: Config["variants"];
};

export type FactoryInternalProps<Config extends FactoryConfig> = DefaultProps<
  InternalRawProps<Config>,
  NonNullable<Config["defaultProps"]>
>;

export type FactoryRenderProps<Config extends FactoryConfig> = FactoryDefaultPropsConfig<Config> &
  FactoryInternalProps<Config>;

export type ComponentFactoryOptions<Config extends FactoryConfig> = FactoryFunctionOptions<
  Config,
  FactoryRenderProps<Config>
>;
