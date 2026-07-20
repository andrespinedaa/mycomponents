import type { ModProps } from "../../system/get-mod";
import type {
  BuiltInMacros,
  ComponentVariants,
  Scales,
  StyleProps,
  SystemCSS,
  Theme,
  ThemeBreakpoints,
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
  orientation?: OrientationProp;
};

export type SystemProps = StyleProps & BaseProps;
export type FactoryStatics = Record<string, React.ComponentType<any>>;

export type FactoryConfig = {
  sizes: keyof ThemeBreakpoints | Scales;
  ownProps: object;
  presets?: string;
  defaultProps: object;
  componentName: string;
  statics?: FactoryStatics;
  variants?: ComponentVariants;
  slots?: Record<string, string>;
  defaultTag: keyof React.JSX.IntrinsicElements;
};

type SlotSets<Config extends FactoryConfig> = NonNullable<Config["slots"]>[keyof NonNullable<
  Config["slots"]
>];

export type ComponentConfig<Config extends FactoryConfig> = Config;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── PÚBLICAS ── el consumidor SÍ puede escribirlas en JSX (<Card size="md" ... />) ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type SizeProp<Config extends FactoryConfig> = {
  size?: Config["sizes"];
};

export type SlotProp<Config extends FactoryConfig> = {
  slots?: keyof Config["slots"];
};

export type SetProp<Config extends FactoryConfig> = {
  set?: Config["presets"] | SlotSets<Config>;
};

export type VariantProp<Config extends FactoryConfig> = {
  variant?: Config["variants"];
};

export type RenderRootProp<Config extends FactoryConfig> = {
  renderRoot?: (props: RenderRootPayload<Config>) => React.ReactNode;
};

export type RenderRootPayload<Config extends FactoryConfig> = Omit<
  React.HTMLAttributes<HTMLElement>,
  "translate"
> &
  ModProps &
  Config["ownProps"] &
  SizeProp<Config> &
  SlotProp<Config> &
  SetProp<Config> &
  VariantProp<Config> & {
    ref?: React.Ref<any>;
    vars?: VarsProp;
  };

export type ConfigProps<Config extends FactoryConfig> = SizeProp<Config> &
  SlotProp<Config> &
  SetProp<Config> &
  VariantProp<Config> &
  RenderRootProp<Config>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── NO PÚBLICAS ── viajan dentro del objeto de props, el consumidor NUNCA debe escribirlas ─
// ════════════════════════════════════════════════════════════════════════════════════════

export type FactoryComputedProps<Config extends FactoryConfig> = {
  ref: PolymorphicRef<Config["defaultTag"]>;
};

export type NonPublicProps<Config extends FactoryConfig> = Partial<FactoryComputedProps<Config>>;

export type FactoryResolvableProps<Config extends FactoryConfig> = {
  size?: Config["sizes"];
  variant?: Config["variants"];
  slots?: keyof Config["slots"];
  set?: Config["presets"] | SlotSets<Config>;
};

export type FactoryInternalProps<Config extends FactoryConfig> = FactoryComputedProps<Config> &
  DefaultProps<FactoryResolvableProps<Config>, NonNullable<Config["defaultProps"]>>;

export type FactoryRenderProps<Config extends FactoryConfig> = FactoryDefaultPropsConfig<Config> &
  FactoryInternalProps<Config>;

export type ComponentFactoryOptions<Config extends FactoryConfig> = FactoryFunctionOptions<
  Config,
  FactoryRenderProps<Config>
>;
