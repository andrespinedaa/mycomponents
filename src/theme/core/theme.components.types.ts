import type { ElementType } from "react";
import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CardSectionConfig,
  InputConfig,
  BoxConfig,
  DividerConfig,
  FlexConfig,
  GridBoxConfig,
  ImgConfig,
  StackConfig,
  TextConfig,
} from "../../components";
import type { FactoryConfig, OrientationProp, RequiredDefaultProps } from "../../factory/core";
import type { Partialized } from "../../types";
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

// ─── StyledBlock — bloque estilizado con soporte de estados anidados (SCSS-like) ───
export type StateNode = StylePropsTokens & Partialized<ComponentStates, StylePropsTokens>;
export type StyledBlock = StylePropsTokens & Partialized<ComponentStates, StateNode>;

// ─── Fields ──────
// ─── Variant Field ─────────────────────────────────────────────────────────────────────────────────
type VariantsField = StyledBlock & Partialized<ComponentVariants, StyledBlock>;

// ─── Size Field ─────────────────────────────────────────────────────────────────────────────────
type SizeField<Config extends FactoryConfig> = Record<Config["sizes"], StylePropsTokens>;

// ─── Stactics Field ─────────────────────────────────────────────────────────────────────────────────
type StaticsField<Config extends FactoryConfig> = Record<
  keyof NonNullable<Config["statics"]>,
  ThemeComponentConfig<any>
>; /* Que añada el Componente primero a supported Components */

// ─── Presets Field ─────────────────────────────────────────────────────────────────────────────────
type PresetsField<Config extends FactoryConfig> = Partialized<
  NonNullable<Config["presets"]>,
  StylePropsTokens
>;

// ─── Orientation Field ─────────────────────────────────────────────────────────────────────────────────
// Genera [data-orientation="X"]. Tokens con DSL $prop se resuelven por-size contra `sizes`
// (ver generateOrientation.ts) — no como var() en runtime, para evitar ciclos de custom properties.
type OrientationField = Partialized<OrientationProp, StylePropsTokens>;

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
  /* ComponentFactories' Properties */
  parentName?: string;
  componentName?: string;
  defaultTag?: ElementType;
  statics?: StaticsField<Config>;
  defaultProps?: RequiredDefaultProps<Config>;
  /* Style's Properties */
  variants?: VariantsField;
  sizes: SizeField<Config>;
  presets?: PresetsField<Config>;
  sections?: SectionsField<Config>;
  orientation?: OrientationField;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]?: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentOptions<any>>;

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
