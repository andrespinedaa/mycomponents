import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryConfig,
} from ".";
import { useResolvedProps } from "../hooks/useResolveProps";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { typedRef } from "../utils";
import { factoryMeta } from "./factoryMeta";

export function ComponentFactory<Config extends FactoryConfig>({
  componentName,
  statics,
  render,
  defaultProps,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(
    (props, ref) => {
      const { theme, resolvedProps } = useResolvedProps(
        componentName,
        props,
        defaultProps,
      );
      return render(resolvedProps, ref, theme);
    },
  ) as unknown as FactoryComponentReturn<Config>;

  return factoryMeta(Component, componentName, statics);
}
