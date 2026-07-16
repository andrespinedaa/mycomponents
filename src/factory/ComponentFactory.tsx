import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryConfig,
  FactoryRenderProps,
  RenderRootPayload,
} from ".";
import { camelToKebab, typedRef } from "../utils";
import { useResolveLayout } from "../hooks";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import { extractStyleProps, getMod, resolvedStyles, resolveStyle } from "../system";
import type { ElementType } from "react";
import { useThemeContext, resolveVarsDSL } from "../theme";

export function ComponentFactory<Config extends FactoryConfig>({
  render,
  statics,
  defaultProps,
  componentName,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>(function ComponentRender(
    props,
    ref,
  ) {
    const { theme } = useThemeContext()
    const componentConfig = theme.components?.[componentName];
    const resolvedTag = typeof render === "string" ? componentConfig?.defaultTag ?? render : render;
    const resolvedComponentName = componentConfig?.componentName ?? componentName;
    const parentName = componentConfig?.parentName;
    const mergedProps = {
      ...(defaultProps ?? {}),
      ...(componentConfig?.defaultProps ?? {}),
      ...props,
    };

    const {
      set,
      size,
      variant,
      dataSlot,
      renderRoot,
      orientation,
      vars: varsRaw,
      "data-slot": inheritedSlot,
      layoutCtx: _inheritedLayoutCtx,
      ...restProps
    } = mergedProps;

    const {
      set: resolvedSet,
      size: resolvedSize,
      variant: resolvedVariant,
      orientation: resolvedOrientation,
    } = useResolveLayout({ size, variant, set, orientation }, theme, componentConfig);
    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName), theme);
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;

    const resolvedDisplayName = parentName
      ? `${parentName}.${resolvedComponentName}`
      : resolvedComponentName;
    if (Component.displayName !== resolvedDisplayName) {
      Component.displayName = resolvedDisplayName;
    }

    if (renderRoot) {
      return renderRoot({
        ref,
        vars,
        set: resolvedSet,
        size: resolvedSize,
        dataSlot: dataName,
        variant: resolvedVariant,
        orientation: resolvedOrientation,
        ...restProps,
      } as RenderRootPayload<Config>);
    }

    if (typeof resolvedTag === "string") {
      const { as, mod, apply, slots, style: styleRaw, unstyled = false, ...rest } = restProps;
      const Element = (as ?? resolvedTag) as ElementType;
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
        { slots },
        { slot: dataName },
        { set: resolvedSet },
        { size: resolvedSize },
        { variant: resolvedVariant },
        { responsive: hasResponsive },
        { orientation: resolvedOrientation },
      ]);
      return <Element ref={ref} style={styles} {...elementProps} {...elementModProps} />;
    }

    return (resolvedTag!)({
      ref,
      vars,
      set: resolvedSet,
      size: resolvedSize,
      dataSlot: dataName,
      variant: resolvedVariant,
      orientation: resolvedOrientation,
      ...restProps,
    } as unknown as FactoryRenderProps<Config>);
  });

  if (statics) {
    Object.assign(Component, statics);
  }

  return Component as unknown as FactoryComponentReturn<Config>;
}
