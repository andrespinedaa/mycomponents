import type React from "react";
import type {
  BuiltInMacros,
  ComponentName,
  ComponentVariants,
  Scales,
  StyleProps,
  SystemCSS,
  Theme,
  ThemeBreakpoints,
  ThemeMacros,
  VarsCss,
} from "../theme";
import type { Prettify } from "../utils/utils.types";

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── Factory ──
// ════════════════════════════════════════════════════════════════════════════════════════

export type FactoryConfig = {
  ownProps: object;
  presets?: string;
  name: ComponentName;
  variants?: ComponentVariants;
  slots?: Record<string, string>;
  tag: keyof React.JSX.IntrinsicElements;
  sizes: keyof ThemeBreakpoints | Scales;
};

export type ComponentConfig<Config extends FactoryConfig> = Config;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── Public System Props ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type ModProp = Record<string, unknown> | string;
export type OrientationProp = "horizontal" | "vertical";
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;
export type StyleProp = SystemCSS | ((theme: Theme) => SystemCSS);
type SlotSets<Config extends FactoryConfig> = NonNullable<Config["slots"]>[keyof NonNullable<
  Config["slots"]
>];

type BaseProps = {
  vars?: VarsCss;
  style?: StyleProp;
  dataSlot?: string;
  unstyled?: boolean;
  className?: string;
  "data-slot"?: string;
  mod?: ModProp | ModProp[];
  children?: React.ReactNode;
  orientation?: OrientationProp;
  apply?: ApplyProp | ApplyProp[];
  renderRoot?: (renderProps: Record<string, unknown>) => React.ReactNode;
};

type AsProp<E extends React.ElementType> = {
  as?: E;
};

type SizeProp<Config extends FactoryConfig> = {
  size?: Config["sizes"];
};

type SlotProp<Config extends FactoryConfig> = {
  slots?: keyof Config["slots"];
};

type SetProp<Config extends FactoryConfig> = {
  set?: Extract<Config["presets"], string> | SlotSets<Config>;
};

type VariantProp<Config extends FactoryConfig> = {
  variant?: Config["variants"];
};

type SystemProps<Config extends FactoryConfig, E extends React.ElementType> = Prettify<
  StyleProps &
    BaseProps &
    AsProp<E> &
    SetProp<Config> &
    SizeProp<Config> &
    SlotProp<Config> &
    VariantProp<Config>
>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── Polymorphism ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type ElementRefType<E extends React.ElementType> = E extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[E]
  : E extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[E]
  : HTMLElement;

export type InternalProps<
  Config extends FactoryConfig,
  E extends React.ElementType,
> = Config["ownProps"] & SystemProps<Config, E>;

export type PolymorphicProps<Config extends FactoryConfig, E extends React.ElementType> = Omit<
  React.ComponentPropsWithoutRef<E>,
  keyof InternalProps<Config, E>
> &
  InternalProps<Config, E> &
  React.RefAttributes<ElementRefType<E>>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── ComponentFactory Function Consumer Layer ───────
// ════════════════════════════════════════════════════════════════════════════════════════

type FactoryProperties = { propTypes?: any; displayName?: string };

export type FactoryOptions<Config extends FactoryConfig> = {
  name: Config["name"];
  render:
    | Config["tag"]
    | ((renderProps: PolymorphicProps<Config, Config["tag"]>) => React.ReactNode);
};

// prettier-ignore
export type FactoryReturn<Config extends FactoryConfig> = {
  <E extends React.ElementType = Config["tag"]>(
    props: PolymorphicProps<Config, E>
  ): React.ReactElement | null;
} & FactoryProperties;
