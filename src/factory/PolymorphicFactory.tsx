import React, { type CSSProperties, type ElementType } from "react";
import { extractStyleProps } from "../system/extract-style-props";
import { useThemeContext } from "../theme/ThemeContext";
import { getMod } from "../utils/get-mod";
import { resolvedStyles } from "../utils/resolve-styles";
import { typedForwardRef } from "../utils/typedForwardRef";
import type {
  FactoryComponentProps,
  FactoryRenderProps,
  PolymorphicComponent,
  SlotProps,
} from "./factory.types";

export function PolymorphicFactoryFn<
  DefaultTag extends ElementType,
  OwnProps = object,
  Statics extends Record<string, unknown> = Record<string, never>,
>(
  defaultTag: DefaultTag,
  render?: (
    renderProps: FactoryRenderProps<DefaultTag, OwnProps>,
  ) => React.ReactElement | null,
  statics?: Statics,
) {
  const PrimitiveComponent = typedForwardRef<
    HTMLElement,
    FactoryComponentProps<DefaultTag, OwnProps>
  >(function PolymorphicComponent(props, ref) {
    const {
      as,
      vars,
      unstyled = false,
      slot,
      mod,
      renderRoot,
      className,
      style,
      ...rest
    } = props;

    const { theme } = useThemeContext();
    const Component = (as ?? defaultTag) as any;
    const { styleProps, elementProps } = extractStyleProps<
      DefaultTag,
      OwnProps
    >(rest);
    const modProps = getMod(mod);
    const slotProps: SlotProps = slot ? { "data-slot": slot } : {};
    const getStyle = (extraStyle?: CSSProperties) =>
      resolvedStyles({ styleProps, vars, style, theme, extraStyle, unstyled });

    if (renderRoot) {
      return (
        renderRoot as (props: Record<string, unknown>) => React.ReactElement
      )({
        ref,
        className,
        ...elementProps,
        ...slotProps,
        ...modProps,
      });
    }

    if (!render) {
      return (
        <Component
          ref={ref}
          className={className}
          style={getStyle()}
          {...elementProps}
          {...slotProps}
          {...modProps}
        />
      );
    }

    return render({
      ref,
      props,
      Component,
      elementProps,
      modProps,
      slotProps,
      getStyle,
    });
  });

  if (statics) Object.assign(PrimitiveComponent, statics);
  return PrimitiveComponent as unknown as PolymorphicComponent<
    DefaultTag,
    OwnProps,
    Statics
  >;
}
