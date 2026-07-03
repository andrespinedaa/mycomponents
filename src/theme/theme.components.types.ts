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
import type {
  ComponentVariants,
  SizeTokens,
  SlotTokens,
  VariantStateConfig,
} from "./theme.variants";

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
  defaultProps?: RequiredDefaultProps<Config>;
  variants?: Partial<Record<ComponentVariants, VariantStateConfig>>;
  sizes?: Partial<Record<NonNullable<Config["sizes"]>, SizeTokens>>;
  // slots — estilos estáticos por slot. slotProp: atributo data-* que discrimina el slot (default "section")
  slots?: Record<string, SlotTokens>;
  slotProp?: string;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

export type ThemeComponentConfig<Config extends FactoryConfig> =
  ThemeComponentOptions<Config>;
