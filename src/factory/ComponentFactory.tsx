import type { ElementType } from "react";
import type { ComponentFactoryOptions, FactoryComponentReturn, FactoryConfig, FactoryRenderProps } from ".";
import { useProps, useTheme } from "../hooks";
import { extractStyleProps, getMod, resolvedStyles, resolveStyle } from "../system";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { typedRef } from "../utils";

export function ComponentFactory<Config extends FactoryConfig>({
  componentName,
  statics,
  render,
  defaultProps,
  defaultTag,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>((props, ref) => {
    const { theme } = useTheme();
    const mergedProps = useProps(theme, props, componentName, defaultProps);

    const {
      as,
      mod,
      size,
      variant,
      dataSlot,
      renderRoot,
      style: styleRaw,
      "data-slot": inheritedSlot,
      ...restProps
    } = mergedProps as typeof mergedProps & { "data-slot"?: string };

    const dataName = dataSlot ?? inheritedSlot ?? componentName;
    const Element = (as ?? defaultTag) as ElementType;

    if (!render && !renderRoot) {
      const { vars, apply, unstyled = false, ...rest } = restProps;
      const { styleProps, componentProps } = extractStyleProps(rest);
      const { styles, hasResponsive } = resolvedStyles({
        styleProps,
        vars,
        style: resolveStyle(styleRaw, theme),
        unstyled,
        apply,
        theme,
      });
      const modProps = getMod([mod, { size }, { variant }, { responsive: hasResponsive }, { slot: dataName }]);
      return <Element ref={ref} style={styles} {...componentProps} {...modProps} />;
    }

    const modProps = getMod([mod, { size }, { variant }, { slot: dataName }]);

    if (renderRoot) return renderRoot({ ref, style: styleRaw, ...restProps, ...modProps });

    return render!({
      style: styleRaw,
      ...restProps,
      ...modProps,
      ref,
      size,
      variant,
    } as FactoryRenderProps<Config>);
  }) as unknown as FactoryComponentReturn<Config>;

  if (componentName) {
    Component.displayName = componentName;
  }

  if (statics && Object.keys(statics).length > 0) {
    Object.entries(statics).forEach(([key, SubComponent]) => {
      if (componentName) {
        SubComponent.displayName = `${componentName}.${key}`;
      }
    });
    Object.assign(Component, statics);
  }

  return Component;
}
