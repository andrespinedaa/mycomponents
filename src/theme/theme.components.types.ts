import type { ButtonConfig } from "../components/Button/Button";
import type { CardConfig } from "../components/Card/Card";
import type { BoxConfig } from "../components/Primitives/Box/Box";
import type { DividerConfig } from "../components/Primitives/Divider/Divider";
import type { FlexConfig } from "../components/Primitives/Flex/Flex";
import type { GridBoxConfig } from "../components/Primitives/Grid/Grid";
import type { ImgConfig } from "../components/Primitives/Image/Image";
import type { StackConfig } from "../components/Primitives/Stack/Stack";
import type { TextConfig } from "../components/Primitives/Text/Text";
import type { RequiredDefaultProps } from "../factory/factories.types";
import type { ComponentVariants, VariantStateConfig } from "./theme.variants";

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
  Button: ButtonConfig;
  Card: CardConfig;
};

export type ThemeComponentConfig<DefaultProps = object> = {
  prefix?: string;
  defaultProps?: Partial<DefaultProps>;
  variants?: Partial<Record<ComponentVariants, VariantStateConfig>>;
};

export type ThemeComponents = {
  [K in keyof ComponentConfigs]-?: ThemeComponentConfig<
    RequiredDefaultProps<ComponentConfigs[K]>
  >;
} & Record<string, ThemeComponentConfig>;
