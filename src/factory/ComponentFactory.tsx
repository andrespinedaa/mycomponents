import { useMemo, type ElementType } from "react";
import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryConfig,
  FactoryRenderProps,
  RenderRootPayload,
} from ".";
import { useTheme, useResolveLayout } from "../hooks";
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
    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName));
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;

    const resolvedDisplayName = parentName
      ? `${parentName}.${resolvedComponentName}`
      : resolvedComponentName;
    if (Component.displayName !== resolvedDisplayName) {
      Component.displayName = resolvedDisplayName;
    }

    const layoutCtx = useMemo(
      () => ({
        size: resolvedSize,
        variant: resolvedVariant,
        set: resolvedSet,
        orientation: resolvedOrientation,
        componentName: resolvedComponentName,
      }),
      [resolvedSize, resolvedVariant, resolvedSet, resolvedOrientation, resolvedComponentName],
    );

    if (!render && !renderRoot) {
      const { as, mod, apply, section, style: styleRaw, unstyled = false, ...rest } = restProps;
      const Element = (as ?? resolvedDefaultTag) as ElementType;
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
        { section },
        { slot: dataName },
        { set: resolvedSet },
        { size: resolvedSize },
        { variant: resolvedVariant },
        { responsive: hasResponsive },
        { orientation: resolvedOrientation },
      ]);
      return <Element ref={ref} style={styles} {...elementProps} {...elementModProps} />;
    }

    if (renderRoot) {
      return renderRoot({
        ref,
        vars,
        layoutCtx,
        set: resolvedSet,
        size: resolvedSize,
        dataSlot: dataName,
        variant: resolvedVariant,
        orientation: resolvedOrientation,
        ...restProps,
      } as RenderRootPayload<Config>);
    }

    return render!({
      ref,
      vars,
      layoutCtx,
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
