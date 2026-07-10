import type { ElementType } from "react";
import type { PolymorphicPropsConfig } from "../types/polimorphic.types";
import type { ComponentFactoryOptions, FactoryComponentReturn, FactoryConfig, FactoryRenderProps } from ".";
import { useTheme } from "../hooks";
import { camelToKebab, typedRef } from "../utils";
import { resolveVarsDSL } from "../theme/generators/css-gen-utils";
import { extractStyleProps, getMod, resolvedStyles, resolveStyle } from "../system";

export function ComponentFactory<Config extends FactoryConfig>({
  render,
  statics,
  defaultTag,
  defaultProps,
  componentName,
}: ComponentFactoryOptions<Config>): FactoryComponentReturn<Config> {
  const Component = typedRef<HTMLElement, PolymorphicPropsConfig<Config>>((props, ref) => {
    const { theme } = useTheme();
    const componentConfig = theme.components?.[componentName];
    const themeDefaults = componentConfig?.defaultProps ?? {};
    const mergedProps = { ...(defaultProps ?? {}), ...themeDefaults, ...props };

    const {
      as,
      mod,
      size,
      preset,
      variant,
      dataSlot,
      renderRoot,
      vars: varsRaw,
      style: styleRaw,
      "data-slot": inheritedSlot,
      ...restProps
    } = mergedProps;

    const resolvedComponentName = componentConfig?.componentName ?? componentName;
    const parentName = componentConfig?.parentName;
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;
    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName));
    const modProps = getMod([mod, { slot: dataName }, { "slot-parent": parentName }]);

    if (!render && !renderRoot) {
      const Element = (as ?? defaultTag) as ElementType;
      const { apply, unstyled = false, ...rest } = restProps;
      const { styleProps, componentProps } = extractStyleProps(rest);
      const { styles, hasResponsive } = resolvedStyles({
        vars,
        apply,
        theme,
        unstyled,
        styleProps,
        style: resolveStyle(styleRaw, theme),
      });
      const ElementModProps = getMod([
        mod,
        { size },
        { preset },
        { variant },
        { slot: dataName },
        { "slot-parent": parentName },
        { responsive: hasResponsive },
      ]);
      return <Element ref={ref} style={styles} {...componentProps} {...ElementModProps} />;
    }

    if (renderRoot) return renderRoot({
      ref,
      vars,
      size,
      preset,
      variant,
      style: styleRaw,
      ...modProps,
      ...restProps,
    } as FactoryRenderProps<Config>);

    return render!({
      ref,
      vars,
      size,
      preset,
      variant,
      style: styleRaw,
      ...modProps,
      ...restProps,
    } as FactoryRenderProps<Config>);
  }) as unknown as FactoryComponentReturn<Config>;

  Component.displayName = componentName;

  if (statics && Object.keys(statics).length > 0) {
    Object.entries(statics).forEach(([key, SubComponent]) => {
      SubComponent.displayName = `${componentName}.${key}`;
    });
    Object.assign(Component, statics);
  }

  return Component;
}
