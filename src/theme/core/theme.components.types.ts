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
import type { ComponentVariants, VariantStates } from "./theme.variants";

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

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  componentName?: string;
  parentName?: string;
  defaultProps?: RequiredDefaultProps<Config>;
  sizes?: Partial<Record<NonNullable<Config["sizes"]>, StylePropsTokens>>;
  variants?: Partial<Record<ComponentVariants, VariantStates>>;
  presets?: Config["presets"] extends string
    ? Partial<Record<Config["presets"], StylePropsTokens>>
    : never;
  slots?: Partial<Record<keyof Config["statics"], ThemeComponentConfig<FactoryConfig>>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
