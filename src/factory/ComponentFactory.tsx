import type {
  ComponentFactoryOptions,
  ComponentRender,
  FactoryComponentReturn,
  FactoryConfig,
} from ".";
import { useResolvedProps } from "../hooks/useResolveProps";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { typedRef } from "../utils";
import { factoryMeta } from "./factoryMeta";
import { Box } from "../components/Primitives/Box/Box";

export function ComponentFactory<Config extends FactoryConfig>({
  componentName,
  statics,
  render,
  defaultProps,
  useHooks,
  defaultTag,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(
    (props, ref) => {
      const { theme, resolvedProps, hooks, size } = useResolvedProps(
        componentName,
        props,
        defaultProps,
        useHooks,
      );

      if (!render) return <Box ref={ref} as={defaultTag} {...(resolvedProps as any)} />;

      return render({
        ...resolvedProps,
        ref,
        theme,
        hooks,
        size,
      } as ComponentRender<Config>);
    },
  ) as unknown as FactoryComponentReturn<Config>;

  return factoryMeta(Component, componentName, statics);
}
