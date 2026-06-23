import type { ResolvedFactoryProps } from "../hooks/useResolveProps";
import type { PolymorphicRef } from "../types/polimorphic.types";
import type { FactoryConfig, RequiredDefaultProps } from "./factories.types";

export type ComponentRenderProps<Config extends FactoryConfig> = (
  resolvedProps: ResolvedFactoryProps<Config>,
  ref: PolymorphicRef<Config["defaultTag"]>,
) => React.ReactNode;

export type ComponentFactoryOptions<Config extends FactoryConfig> = {
  componentName?: Config["componentName"];
  defaultTag: Config["defaultTag"];
  render: ComponentRenderProps<Config>;
  statics?: Config["statics"];
  defaultProps?: RequiredDefaultProps<Config>;
};
