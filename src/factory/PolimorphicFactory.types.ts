import type { ElementType } from "react";
import type {
  FactoryConfig,
  FactoryOptions,
  BaseRenderProps,
} from "./factories.types";

export type PolymorphicRenderProps<Config extends FactoryConfig> =
  BaseRenderProps<Config> & {
    Component: ElementType;
  };

export type PolymorphicFactoryOptions<Config extends FactoryConfig> =
  FactoryOptions<Config, PolymorphicRenderProps<Config>>;
