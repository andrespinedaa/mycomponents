import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
  CardSectionConfig,
  InputConfig,
} from "../components";
import type {
  BoxConfig,
  DividerConfig,
  FlexConfig,
  GridBoxConfig,
  ImgConfig,
  StackConfig,
  TextConfig,
} from "../components/Primitives";
import type { FactoryConfig } from "../factory/core/factories.types";
import type { RequiredDefaultProps } from "../factory/core/factory.defaults";
import type { ComponentVariants, SizeTokens, SlotTokens, VariantStateConfig } from "./theme.variants";

export type ComponentConfigs = {
  /* Primitives */
  Box: BoxConfig;
  Text: TextConfig;
  Flex: FlexConfig;
  Divider: DividerConfig;
  Grid: GridBoxConfig;
  Image: ImgConfig;
  Stack: StackConfig;
  /* Components */
  Alert: AlertConfig;
  Avatar: AvatarConfig;
  Badge: BadgeConfig;
  Button: ButtonConfig;
  Card: CardConfig;
  CardSection: CardSectionConfig;
  Input: InputConfig;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  prefix?: string;
  slotProp?: string;
  defaultProps?: RequiredDefaultProps<Config>;
  slots?: Record<keyof Config["statics"], SlotTokens>;
  sizes?: Partial<Record<NonNullable<Config["sizes"]>, SizeTokens>>;
  variants?: Partial<Record<ComponentVariants, VariantStateConfig>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

export type ThemeComponentConfig<Config extends FactoryConfig> = ThemeComponentOptions<Config>;
