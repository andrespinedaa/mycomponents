import React from "react";
import { resolveLayout, resolveStyle, resolveSystemStyles, resolveVars } from "./resolvers";
import { camelToKebab } from "../utils";
import type {
  ElementRefType,
  FactoryConfig,
  FactoryOptions,
  FactoryReturn,
  InternalProps,
  PolymorphicProps,
} from "./factories.types";
import { extractStyleProps, extractMod } from "./extractors";
import { useSystemContext, useThemeContext } from "../context";

export function ComponentFactory<Config extends FactoryConfig>({
  name,
  render,
  statics,
}: FactoryOptions<Config>): FactoryReturn<Config> {
  const Component = React.forwardRef<
    ElementRefType<Config["tag"]>,
    InternalProps<Config, Config["tag"]>
  >(function ComponentRender(props, ref) {
    const { theme } = useThemeContext();
    const { tokenVars, sizeResponsive, smallestBreakpoint } = useSystemContext();
    const config = theme.components?.[name];
    const resolvedName = config?.name ?? name;

    const {
      set,
      size,
      variant,
      dataSlot,
      renderRoot,
      orientation,
      vars: varsRaw,
      "data-slot": inheritedSlot,
      ...restProps
    } = props;

    const {
      set: resolvedSet,
      size: resolvedSize,
      variant: resolvedVariant,
      orientation: resolvedOrientation,
    } = resolveLayout(sizeResponsive, { size, variant, set, orientation }, config);
    const resolvedVars = resolveVars(camelToKebab(resolvedName), varsRaw, tokenVars);
    const dataName = dataSlot || inheritedSlot || resolvedName || undefined;

    if (renderRoot) {
      return renderRoot({
        ref,
        set: resolvedSet,
        vars: resolvedVars,
        size: resolvedSize,
        dataSlot: dataName,
        variant: resolvedVariant,
        orientation: resolvedOrientation,
        ...restProps,
      });
    }

    if (typeof render === "string") {
      const { as, mod, apply, slots, style: styleRaw, unstyled = false, ...rest } = restProps;
      const Element = (as ?? render) as React.ElementType;
      const { styleProps, elementProps } = extractStyleProps(rest);
      const { styles, hasResponsive } = resolveSystemStyles({
        apply,
        theme,
        tokenVars,
        unstyled,
        styleProps,
        vars: resolvedVars,
        smallestBreakpoint,
        style: resolveStyle(theme, styleRaw, tokenVars),
      });
      const elementModProps = extractMod(
        [
          mod,
          { slots },
          { slot: dataName },
          { set: resolvedSet },
          { size: resolvedSize },
          { variant: resolvedVariant },
          { responsive: hasResponsive },
          { orientation: resolvedOrientation },
        ],
        smallestBreakpoint,
      );
      return <Element ref={ref} style={styles} {...elementProps} {...elementModProps} />;
    }

    return render({
      ref,
      set: resolvedSet,
      vars: resolvedVars,
      size: resolvedSize,
      dataSlot: dataName,
      variant: resolvedVariant,
      orientation: resolvedOrientation,
      ...restProps,
    } as unknown as PolymorphicProps<Config, Config["tag"]>);
  });

  Component.displayName = name;

  if (statics) {
    Object.assign(Component, statics);
  }

  return Component as unknown as FactoryReturn<Config>;
}
