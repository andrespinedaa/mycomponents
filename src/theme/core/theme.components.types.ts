import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  InputConfig,
} from "../../components";
import type {
  BoxConfig,
  DividerConfig,
  FlexConfig,
  GridBoxConfig,
  ImgConfig,
  StackConfig,
  TextConfig,
} from "../../components/Primitives";
import type { FactoryConfig, RequiredDefaultProps } from "../../factory/core";
import type { StylePropsTokens } from "../generators/system-css.types";
import type { ComponentStates, ComponentVariants } from "./theme.types";

export type ComponentConfigs = {
  /* Primitives */
  Box: BoxConfig;
  Text: TextConfig;
  Flex: FlexConfig;
  Image: ImgConfig;
  Stack: StackConfig;
  Grid: GridBoxConfig;
  Divider: DividerConfig;
  /* Components */
  Card: CardConfig;
  Alert: AlertConfig;
  Badge: BadgeConfig;
  Input: InputConfig;
  Avatar: AvatarConfig;
  Button: ButtonConfig;
};

export type VariantStates = Partial<Record<ComponentStates, StylePropsTokens>>;

type PartialPresets<Config extends FactoryConfig> = Partial<
  Record<NonNullable<Config["presets"]>, StylePropsTokens>
>;

type SectionEntry<Config extends FactoryConfig> = StylePropsTokens & {
  presets?: PartialPresets<Config>;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  parentName?: string;
  componentName?: string;
  presets?: PartialPresets<Config>;
  defaultProps?: RequiredDefaultProps<Config>;
  sizes?: Partial<Record<Config["sizes"], StylePropsTokens>>;
  variants?: Partial<Record<ComponentVariants, VariantStates>>;
  slots?: Record<keyof Config["statics"], ThemeComponentConfig<FactoryConfig>>;
  sections?: Partial<Record<NonNullable<Config["sections"]>, SectionEntry<Config>>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
