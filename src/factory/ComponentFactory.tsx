import type { ElementType } from "react";
import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryConfig,
  FactoryRenderProps,
  RenderRootPayload,
} from ".";
import { useTheme } from "../hooks";
import { extractStyleProps, getMod, resolvedStyles, resolveStyle } from "../system";
import { resolveVarsDSL } from "../theme/generators/css-gen-utils";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { camelToKebab, typedRef } from "../utils";

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
    const resolvedDefaultTag = componentConfig?.defaultTag ?? defaultTag;
    const resolvedComponentName = componentConfig?.componentName ?? componentName;
    const parentName = componentConfig?.parentName;
    const mergedProps = {
      ...(defaultProps ?? {}),
      ...(componentConfig?.defaultProps ?? {}),
      ...props,
    };

    const {
      as,
      mod,
      set,
      size,
      apply,
      section,
      variant,
      dataSlot,
      renderRoot,
      vars: varsRaw,
      style: styleRaw,
      unstyled = false,
      "data-slot": inheritedSlot,
      ...restProps
    } = mergedProps;

    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName));
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;

    Component.displayName = parentName
      ? `${parentName}.${resolvedComponentName}`
      : resolvedComponentName;

    if (statics) Object.assign(Component, statics);

    if (!render && !renderRoot) {
      const Element = (as ?? resolvedDefaultTag) as ElementType;
      const { styleProps, elementProps } = extractStyleProps(restProps);
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
        { set },
        { size },
        { section },
        { variant },
        { slot: dataName },
        { "slot-parent": parentName },
        { responsive: hasResponsive },
      ]);
      return <Element ref={ref} style={styles} {...elementProps} {...elementModProps} />;
    }

    if (renderRoot) {
      const modProps = getMod([
        mod,
        { set },
        { size },
        { section },
        { variant },
        { slot: dataName },
        { "slot-parent": parentName },
      ]);
      return renderRoot({
        set,
        ref,
        size,
        vars,
        variant,
        section,
        style: styleRaw,
        ...modProps,
        ...restProps,
      } as unknown as RenderRootPayload<Config>);
    }

    return render!({
      set,
      ref,
      size,
      vars,
      section,
      variant,
      style: styleRaw,
      dataSlot: dataName,
      ...restProps,
    } as unknown as FactoryRenderProps<Config>);
  });

  Component.displayName = componentName;
  if (statics) {
    Object.assign(Component, statics);
  }

  return Component as unknown as FactoryComponentReturn<Config>;
}
