import type {
  AlertConfig,
  AvatarConfig,
  BadgeConfig,
  ButtonConfig,
  CardConfig,
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
import type {
  FactoryConfig,
  RequiredDefaultProps,
} from "../factory/factories.types";
import type {
  ComponentVariants,
  SizeTokens,
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
  Input: InputConfig;
};

export type ThemeComponentOptions<Config extends FactoryConfig> = {
  prefix?: string;
  defaultProps?: RequiredDefaultProps<Config>;
  variants?: Partial<Record<ComponentVariants, VariantStateConfig>>;
  sizes?: Partial<Record<NonNullable<Config["sizes"]>, SizeTokens>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]: ThemeComponentOptions<ComponentConfigs[K]>;
} & Record<string, ThemeComponentConfig<FactoryConfig>>;

export type ThemeComponentConfig<Config extends FactoryConfig> =
  ThemeComponentOptions<Config>;
