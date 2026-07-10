import { useLayoutContext } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { Flex } from "../Primitives";

export type CardSectionSets = "default" | "background" | "top" | "gradient";

export interface CardSectionOwnProps {
  preset?: CardSectionSets;
}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  statics: EmptyStatics;
  sections: "header" | "body" | "footer" | "media";
  defaultProps: { section: "body"; preset: "default" };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Default";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  defaultTag: "div",
  componentName: "CardSection",
  defaultProps: { section: "body", preset: "default" },
  render: function CardSectionRender({ ref, ...rest }) {
    const { size } = useLayoutContext();
    return <Flex ref={ref} mod={{ size }} {...rest} />;
  },
});
