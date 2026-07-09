import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CardSectionConfig,
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
  CardSection: CardSectionConfig;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  prefix?: string;
  prefixParent?: string;
  slots?: Partial<Record<keyof Config["statics"], StylePropsTokens>>;
  presets?: Record<string, Partial<Record<Config["sets"], StylePropsTokens>>>;
  defaultProps?: RequiredDefaultProps<Config>;
  sizes?: Partial<Record<Config["sizes"], StylePropsTokens>>;
  variants?: Partial<Record<ComponentVariants, VariantStates>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
