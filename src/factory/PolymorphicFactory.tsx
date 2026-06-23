import { type CSSProperties, type ElementType } from "react";
import { useResolvedProps } from "../hooks/useResolveProps";
import { extractStyleProps } from "../system/extract-style-props";
/* import { resolvedStyles } from "../system/resolve-styles"; */
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { typedRef } from "../utils/typedRef";
import type { FactoryComponentReturn, FactoryConfig } from "./factories.types";
import { factoryMeta } from "./factoryMeta";
import type { PolymorphicFactoryOptions } from "./PolimorphicFactory.types";
import { resolvedStyles } from "../system/resolve-styles";

export function PolymorphicFactory<Config extends FactoryConfig>({
  componentName,
  defaultTag,
  render,
  statics,
  defaultProps,
}: PolymorphicFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const PolyComponent = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(
    function PolymorphicComponent(props, ref) {
      const { theme, resolvedProps: resolved } = useResolvedProps<Config>(componentName, props, defaultProps);
      const {
        as,
        vars,
        unstyled = false,
        renderRoot,
        style,
        apply,
        ...rest
      } = resolved;
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

      if (renderRoot) return renderRoot({ ref, ...componentProps });

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
        ref,
        props,
        Component,
        componentProps,
        getStyle,
      });
    },
  ) as unknown as FactoryComponentReturn<Config>;

  return factoryMeta(PolyComponent, componentName, statics);
}
