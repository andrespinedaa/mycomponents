import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CardSectionConfig,
  DotConfig,
  InputConfig,
  BoxConfig,
  DividerConfig,
  GridBoxConfig,
  ImgConfig,
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
  Image: ImgConfig;
  Grid: GridBoxConfig;
  Divider: DividerConfig;
  /* Components */
  Card: CardConfig;
  CardSection: CardSectionConfig;
  Alert: AlertConfig;
  Avatar: AvatarConfig;
  Badge: BadgeConfig;
  Button: ButtonConfig;
  Dot: DotConfig;
  Input: InputConfig;
};

// ─── StyledBlock — bloque estilizado con soporte de estados anidados (SCSS-like) ───
export type Block<K extends keyof any, V> = StylePropsTokens & Partialized<K, V>;
export type StateNode = Block<ComponentStates, StylePropsTokens>;
export type StyledBlock = Block<ComponentStates, StateNode>;

// ─── Fields ──────
// ─── Variant Field ─────────────────────────────────────────────────────────────────────────────────
type VariantsField = StyledBlock & Partialized<ComponentVariants, StyledBlock>;

// ─── Size Field ─────────────────────────────────────────────────────────────────────────────────
type SizeField<Config extends FactoryConfig> = Record<Config["sizes"], StylePropsTokens>;

// ─── Stactics Field ─────────────────────────────────────────────────────────────────────────────────
type StaticsField<Config extends FactoryConfig> = Record<
  keyof NonNullable<Config["statics"]>,
  ThemeComponentConfig<any>
>;

// ─── Preset Entry ─────────────────────────────────────────────────────────────────────────────────
export type PresetEntry = StyledBlock & {
  orientation?: Partialized<OrientationProp, StyledBlock>;
};

// ─── Presets Field ─────────────────────────────────────────────────────────────────────────────────
type PresetsField<Config extends FactoryConfig> = Partialized<
  NonNullable<Config["presets"]>,
  PresetEntry
>;

// ─── Orientation Field ─────────────────────────────────────────────────────────────────────────────────
type OrientationField = Partialized<OrientationProp, StylePropsTokens>;

// ─── Slots Field ─────────────────────────────────────────────────────────────────────────────────
export type SlotEntry<Presets extends string = string> = StyledBlock & {
  presets?: Partialized<Presets, PresetEntry>;
};
type SlotsField<Config extends FactoryConfig> = {
  [K in keyof NonNullable<Config["slots"]>]?: SlotEntry<
    NonNullable<Config["slots"]>[K] & string
  >;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  /* ComponentFactories' Properties */
  parentName?: string;
  componentName?: string;
  defaultTag?: keyof React.JSX.IntrinsicElements;
  statics?: StaticsField<Config>;
  defaultProps?: RequiredDefaultProps<Config>;
  /* Style's Properties */
  variants?: VariantsField;
  sizes?: SizeField<Config>;
  presets?: PresetsField<Config>;
  slots?: SlotsField<Config>;
  orientation?: OrientationField;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]?: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentOptions<any>>;

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
