import { type CSSProperties, type ElementType } from "react";
import { useResolvedProps } from "../hooks/useResolveProps";
import { extractStyleProps, resolvedStyles } from "../system";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { typedRef } from "../utils/typedRef";
import type { FactoryComponentReturn, FactoryConfig } from "./factories.types";
import { factoryMeta } from "./factoryMeta";
import type {
  PolymorphicFactoryOptions,
  PolymorphicRenderProps,
} from "./PolimorphicFactory.types";

export function PolymorphicFactory<Config extends FactoryConfig>({
  componentName,
  defaultTag,
  render,
  statics,
  defaultProps,
  useHooks,
}: PolymorphicFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const PolyComponent = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(
    function PolymorphicComponent(props, ref) {
      const { theme, resolvedProps, hooks, size } = useResolvedProps<Config>(
        componentName,
        props,
        defaultProps,
        useHooks,
      );

      const {
        as,
        vars,
        unstyled = false,
        renderRoot,
        style,
        apply,
        ...rest
      } = resolvedProps;

      const { styleProps, componentProps } = extractStyleProps(rest);
      const Component = (as ?? defaultTag) as ElementType;

      const getStyle = (extraStyle?: CSSProperties) =>
        resolvedStyles({
          styleProps,
          vars,
          style,
          extraStyle,
          unstyled,
          apply,
          theme,
        });

      if (renderRoot) {
        const { styles } = getStyle();
        return renderRoot({ ref, style: styles, ...componentProps });
      }

      if (!render) {
        const { styles, hasResponsive } = getStyle();
        return (
          <Component
            ref={ref}
            style={styles}
            data-responsive={hasResponsive ? "" : undefined}
            {...componentProps}
          />
        );
      }

      return render({
        ...resolvedProps,
        ref,
        theme,
        hooks,
        size,
        Component,
      } as PolymorphicRenderProps<Config>);
    },
  ) as unknown as FactoryComponentReturn<Config>;

  return factoryMeta(PolyComponent, componentName, statics);
}
