import type { ElementType } from "react";
import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  InputConfig,
} from "../../components";
import type { CardSectionConfig } from "../../components/Card/CardSection";
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
  CardSection: CardSectionConfig;
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

type PartialSections<Config extends FactoryConfig> = Partial<
  Record<
    NonNullable<Config["sections"]>,
    Partial<Record<NonNullable<Config["presets"]>, StylePropsTokens>>
  >
>;

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  parentName?: string;
  componentName?: string;
  defaultTag?: ElementType;
  presets?: PartialPresets<Config>;
  sections?: PartialSections<Config>;
  defaultProps?: RequiredDefaultProps<Config>;
  sizes?: Partial<Record<Config["sizes"], StylePropsTokens>>;
  variants?: Partial<Record<ComponentVariants, VariantStates>>;
  slots?: Record<keyof Config["statics"], ThemeComponentConfig<FactoryConfig>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
