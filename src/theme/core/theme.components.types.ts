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
  GridConfig,
  ImgConfig,
  TextConfig,
  GridItemConfig,
} from "../../components";
import type { FactoryConfig, OrientationProp } from "../../factory";
import type { Partialized } from "../../utils/utils.types";
import type { StylePropsTokens } from "../generators/system-css.types";
import type { ComponentStates, ComponentVariants } from "./theme.types";

// ─── StyledBlock (SCSS-like) ───
type Block<K extends keyof any, V> = StylePropsTokens & Partialized<K, V>;
type StateNode = Block<ComponentStates, StylePropsTokens>;
export type StyledBlock = Block<ComponentStates, StateNode>;

// ─── Fields ──────
// ─── Variant Field ─────────────────────────────────────────────────────────────────────────────────
type VariantsField = StyledBlock & Partialized<ComponentVariants, StyledBlock>;

// ─── Size Field ─────────────────────────────────────────────────────────────────────────────────
type SizeField<Config extends FactoryConfig> = Record<Config["sizes"], StylePropsTokens>;

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
  [K in keyof NonNullable<Config["slots"]>]?: SlotEntry<NonNullable<Config["slots"]>[K] & string>;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  name?: string;
  parentName?: string;
  variants?: VariantsField;
  sizes?: SizeField<Config>;
  slots?: SlotsField<Config>;
  presets?: PresetsField<Config>;
  orientation?: OrientationField;
};

export interface ComponentConfigs {
  /* Primitives */
  Box: BoxConfig;
  Text: TextConfig;
  Image: ImgConfig;
  Grid: GridConfig;
  GridItem: GridItemConfig;
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

export type ComponentName = keyof ComponentConfigs;

type AnyComponentConfig = ComponentConfigs[ComponentName];

export type ThemeComponents = {
  [K in ComponentName]?: ThemeComponentOptions<AnyComponentConfig>;
};

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
