import { useMemo } from "react";
import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type OrientationProp } from "../../factory";
import { Flex } from "../Primitives";
import { CardSection } from "./CardSection";
import { useResolveLayout } from "../../hooks";

export interface CardOwnProps {
  orientation?: OrientationProp;
}

export type CardConfig = ComponentConfig<{
  defaultTag: "div";
  componentName: "Card";
  ownProps: CardOwnProps;
  sizes: "sm" | "md" | "lg" | "xl";
  statics: { Section: typeof CardSection };
  defaultProps: { orientation: "vertical"; preset: "vertical" };
  variants: "Filled" | "Elevated" | "Default" | "Outlined";
  presets: "vertical" | "horizontal";
}>;

export const Card = ComponentFactory<CardConfig>({
  defaultTag: "div",
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: {
    orientation: "vertical",
    variant: "Default",
    size: "md",
    cursor: "pointer",
    preset: "vertical",
  },
  render: function CardRender({ orientation, variant, children, ref, size, preset, ...rest }) {
    const { flexOrientation } = useResolveLayout({ orientation });
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
