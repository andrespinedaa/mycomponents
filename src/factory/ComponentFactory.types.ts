import type {
  FactoryConfig,
  FactoryOptions,
  BaseRenderProps,
} from "./factories.types";

export type ComponentRender<Config extends FactoryConfig> = BaseRenderProps<Config>;

export type ComponentFactoryOptions<Config extends FactoryConfig> =
  FactoryOptions<Config, ComponentRender<Config>>;
