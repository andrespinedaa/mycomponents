import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type OrientationProp } from "../../factory";
import { Flex } from "../Primitives";
import { CardSection } from "./CardSection";

export interface CardOwnProps {
  orientation?: OrientationProp;
}

export type CardConfig = ComponentConfig<{
  defaultTag: "div";
  componentName: "Card";
  ownProps: CardOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  statics: { Section: typeof CardSection };
  defaultProps: { orientation: "vertical", variant: "Filled" };
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const Card = ComponentFactory<CardConfig>({
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: { orientation: "vertical", variant: "Filled" },
  render: function CardRender({ ref, layoutCtx, size, variant, children, orientation, ...rest }) {
    return (
      <LayoutProvider value={layoutCtx}>
        <Flex ref={ref} mod={[{ orientation, size, variant }]} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
