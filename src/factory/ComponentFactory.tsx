import type { ElementType } from "react";
import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryConfig,
  FactoryRenderProps,
  RenderRootPayload,
} from ".";
import { useTheme } from "../hooks";
import { camelToKebab, typedRef } from "../utils";
import { resolveVarsDSL } from "../theme/generators/css-gen-utils";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { extractStyleProps, getMod, resolvedStyles, resolveStyle } from "../system";

export function ComponentFactory<Config extends FactoryConfig>({
  render,
  statics,
  defaultTag,
  defaultProps,
  componentName,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(function ComponentRender(
    props,
    ref,
  ) {
    const { theme } = useTheme();
    const componentConfig = theme.components?.[componentName];
    const resolvedComponentName = componentConfig?.componentName ?? componentName;
    const parentName = componentConfig?.parentName;
    const mergedProps = {
      ...(defaultProps ?? {}),
      ...(componentConfig?.defaultProps ?? {}),
      ...props,
    };

    const {
      mod,
      dataSlot,
      renderRoot,
      vars: varsRaw,
      "data-slot": inheritedSlot,
      ...restProps
    } = mergedProps;

    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName));
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;

    Component.displayName = resolvedComponentName;
    if (statics) {
      Object.entries(statics).forEach(([key, SubComponent]) => {
        SubComponent.displayName = `${resolvedComponentName}.${key}`;
      });
    }

    if (!render && !renderRoot) {
      const {
        as,
        size,
        apply,
        preset,
        section,
        variant,
        style: styleRaw,
        unstyled = false,
        ...rest
      } = restProps;
      const Element = (as ?? defaultTag) as ElementType;
      const { styleProps, elementProps } = extractStyleProps(rest);
      const { styles, hasResponsive } = resolvedStyles({
        vars,
        apply,
        theme,
        unstyled,
        styleProps,
        style: resolveStyle(styleRaw, theme),
      });
      const elementModProps = getMod([
        mod,
        { size },
        { preset },
        { section },
        { variant },
        { slot: dataName },
        { "slot-parent": parentName },
        { responsive: hasResponsive },
      ]);
      return <Element ref={ref} style={styles} {...elementProps} {...elementModProps} />;
    }

    const modProps = getMod([mod, { slot: dataName }, { "slot-parent": parentName }]);
    const basePayload = { vars, ...modProps, ...restProps };

    if (renderRoot) {
      return renderRoot({ ref, ...basePayload } as unknown as RenderRootPayload<Config>);
    }
    return render!({ ref, ...basePayload } as FactoryRenderProps<Config>);
  });

  Component.displayName = componentName;
  if (statics) {
    Object.assign(Component, statics);
  }

  return Component as unknown as FactoryComponentReturn<Config>;
}
