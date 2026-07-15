import { useMemo, type ElementType } from "react";
import type {
  ComponentFactoryOptions,
  FactoryComponentReturn,
  FactoryComputedProps,
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

    // layoutCtx nunca es un prop público (ver PolymorphicPropsConfig) — solo se filtra a runtime
    // si un ancestro sin `render` propio lo dejó pasar en un ...rest. Se descarta aquí, en el único
    // punto de entrada, para que ningún componente dependa de acordarse de destructurarlo.
    const {
      set,
      size,
      variant,
      dataSlot,
      layoutCtx: _inheritedLayoutCtx,
      renderRoot,
      orientation,
      vars: varsRaw,
      dataSlotParent,
      "data-slot": inheritedSlot,
      ...restProps
    } = mergedProps as typeof mergedProps & Partial<Pick<FactoryComputedProps<Config>, "layoutCtx">>;

    const {
      set: resolvedSet,
      size: resolvedSize,
      variant: resolvedVariant,
      orientation: resolvedOrientation,
    } = useResolveLayout({ size, variant, set, orientation }, theme);
    const vars = resolveVarsDSL(varsRaw, camelToKebab(resolvedComponentName));
    const dataName = dataSlot || inheritedSlot || resolvedComponentName || undefined;

    const resolvedDisplayName = parentName
      ? `${parentName}.${resolvedComponentName}`
      : resolvedComponentName;
    if (Component.displayName !== resolvedDisplayName) {
      Component.displayName = resolvedDisplayName;
    }

    const layoutCtx = useMemo(
      () => ({ size: resolvedSize, variant: resolvedVariant, set: resolvedSet, orientation: resolvedOrientation }),
      [resolvedSize, resolvedVariant, resolvedSet, resolvedOrientation],
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
        { orientation: resolvedOrientation },
        { "slot-parent": parentName ?? dataSlotParent },
        { responsive: hasResponsive },
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
        dataSlotParent: parentName,
        orientation: resolvedOrientation,
        ...restProps,
      } as RenderRootPayload<Config>);
    }

    // as unknown as — necesario, no negligente: FactoryRenderProps<Config> depende de
    // Config["defaultProps"] vía un mapped type condicional (DefaultProps<...>). Dentro de esta
    // función genérica, Config todavía es abstracto, así que TS no puede resolver qué keys son
    // requeridas y rechaza el cast directo ("neither type sufficiently overlaps"). La garantía de
    // tipos para cada componente concreto (Card, Badge, etc.) SÍ se verifica correctamente del lado
    // del consumidor — ver FactoryComponentReturn — este límite es solo de la implementación genérica.
    return render!({
      ref,
      vars,
      layoutCtx,
      set: resolvedSet,
      size: resolvedSize,
      dataSlot: dataName,
      variant: resolvedVariant,
      dataSlotParent: parentName,
      orientation: resolvedOrientation,
      ...restProps,
    } as unknown as FactoryRenderProps<Config>);
  });

  if (statics) {
    Object.assign(Component, statics);
  }

  return Component as unknown as FactoryComponentReturn<Config>;
}
