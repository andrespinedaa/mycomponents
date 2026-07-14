import { useMemo } from "react";
import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type OrientationProp } from "../../factory";
import { Flex } from "../Primitives";
import { CardSection } from "./CardSection";
import { useResolveLayout, useSize } from "../../hooks";

export interface CardOwnProps {
  orientation?: OrientationProp;
}

export type CardConfig = ComponentConfig<{
  defaultTag: "div";
  componentName: "Card";
  ownProps: CardOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  statics: { Section: typeof CardSection };
  defaultProps: { orientation: "vertical" };
  variants: "Filled" | "Elevated" | "Outlined";
  presets: "compact" | "reverse";
}>;

export const Card = ComponentFactory<CardConfig>({
  defaultTag: "div",
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: { orientation: "vertical", },
  render: function CardRender({
    ref,
    set,
    children,
    orientation,
    size: _size,
    variant: _variant,
    ...rest
  }) {
    const { flexOrientation, variant } = useResolveLayout({
      orientation,
      variant: _variant,
    });
    const { size } = useSize(_size);
    const ctx = useMemo(() => ({ orientation, size, variant }), [orientation, size, variant]);
    return (
      <LayoutProvider value={ctx}>
        <Flex ref={ref} mod={[{ orientation, size, variant }]} flexDir={flexOrientation} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
