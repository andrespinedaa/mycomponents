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
import type { StylePropsTokens } from "../../system/system.types";
import type { ComponentStates } from "../theme.types";
import type { LayoutConfig } from "../../components/Primitives/Layout/Layout";
import type { MenuConfig } from "../../components/Menu/Menu";
import type { ItemConfig } from "../../components/Menu/Item";

// ─── StyledBlock (SCSS-like) ───
type Block<K extends keyof any, V> = StylePropsTokens & Partialized<K, V>;
type StateNode = Block<ComponentStates, StylePropsTokens>;
export type StyledBlock = Block<ComponentStates, StateNode>;

// ─── Fields ──────
// ─── Variant Field ─────────────────────────────────────────────────────────────────────────────────
type VariantsField<Config extends FactoryConfig> = StyledBlock &
  Partialized<NonNullable<Config["variants"]>, StyledBlock>;

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
  variants?: VariantsField<Config>;
  sizes?: SizeField<Config>;
  slots?: SlotsField<Config>;
  presets?: PresetsField<Config>;
  orientation?: OrientationField;
};

// Punto de extensión del consumidor — TypeScript fusiona `interface` nativamente,
// así que un consumidor externo puede agregar sus propios componentes con:
//   declare module "mycomponents" { interface ComponentConfigs { MyWidget: MyWidgetConfig } }
// No usar el patrón Base+Consumer+Merge aquí: ese patrón es solo para `type` aliases,
// que no fusionan declaraciones. Esto ya es `interface` — abierto por diseño del lenguaje.
export interface ComponentConfigs {
  /* Primitives */
  Box: BoxConfig;
  Text: TextConfig;
  Image: ImgConfig;
  Grid: GridConfig;
  Layout: LayoutConfig;
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
  Menu: MenuConfig;
  Item: ItemConfig;
};

export type ComponentName = keyof ComponentConfigs;

export type ThemeComponents = {
  [K in ComponentName]?: ThemeComponentOptions<ComponentConfigs[K]>;
};

// helpers
export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
