import { useMemo } from "react";
import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type OrientationProp } from "../../factory";
import type { SystemVariants } from "../../theme";
import { Flex } from "../Primitives";
import { CardSection } from "./CardSection";

export interface CardOwnProps {
  orientation?: OrientationProp;
  variant?: SystemVariants<"Filled" | "Elevated" | "Default" | "Outlined">;
}

export type CardConfig = ComponentConfig<{
  componentName: "Card";
  defaultTag: "div";
  ownProps: CardOwnProps;
  statics: {
    Section: typeof CardSection;
  };
  defaultProps: {
    orientation: "vertical";
    variant: "Default";
    size: "md";
  };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: "";
}>;

export const Card = ComponentFactory<CardConfig>({
  defaultTag: "div",
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: { orientation: "vertical", variant: "Default", size: "md", cursor: "pointer" },
  render: function CardRender({ orientation, variant, children, ref, size, ...rest }) {
    const ctx = useMemo(() => ({ orientation, size, variant }), [orientation, size, variant]);
    return (
      <LayoutProvider value={ctx}>
        <Flex ref={ref} mod={[{ orientation, size, variant }]} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
