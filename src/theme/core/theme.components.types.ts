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
import type { ComponentStates, ComponentVariants, ThemeBreakpoints } from "./theme.types";
import type { Partialized } from "../../types";

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

// ─── StyledBlock — bloque estilizado con soporte de estados anidados (SCSS-like) ───
type StateNode = StylePropsTokens & Partialized<ComponentStates, StylePropsTokens>;
export type StyledBlock = StylePropsTokens & Partialized<ComponentStates, StateNode>;

// ─── Fields ─────────────────────────────────────────────────────────────────────────────────
// ─── Variant Field ─────────────────────────────────────────────────────────────────────────────────
type VariantsField = StyledBlock & Partialized<ComponentVariants, StyledBlock>;

// ─── Size Field ─────────────────────────────────────────────────────────────────────────────────
type SizeField<Config extends FactoryConfig> = Record<
  keyof ThemeBreakpoints & Config["sizes"],
  StylePropsTokens
> &
  Partialized<Exclude<Config["sizes"], keyof ThemeBreakpoints>, StylePropsTokens>;

// ─── Stactics Field ─────────────────────────────────────────────────────────────────────────────────
type StaticsField<Config extends FactoryConfig> = Record<
  keyof NonNullable<Config["statics"]>,
  ThemeComponentConfig<FactoryConfig>
>;

// ─── Presets Field ─────────────────────────────────────────────────────────────────────────────────
type PresetsField<Config extends FactoryConfig> = Partialized<
  NonNullable<Config["presets"]>,
  StylePropsTokens
>;

// ─── Sections Field ─────────────────────────────────────────────────────────────────────────────────
export type SlotEntry<Presets extends string = string> = StyledBlock & {
  presets?: Partialized<Presets, StyledBlock>;
};
type SectionsField<Config extends FactoryConfig> = StyledBlock & {
  slots?: {
    [K in keyof NonNullable<Config["sections"]>]?: SlotEntry<
      NonNullable<Config["sections"]>[K] & string
    >;
  };
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  /* Propiedades ComponentFactory */
  parentName?: string;
  componentName?: string;
  defaultTag?: ElementType;
  statics?: StaticsField<Config>;
  defaultProps?: RequiredDefaultProps<Config>;
  /* Propiedades Styles */
  variants?: VariantsField;
  sizes?: SizeField<Config>;
  presets?: PresetsField<Config>;
  sections?: SectionsField<Config>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
