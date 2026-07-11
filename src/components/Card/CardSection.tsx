import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useResolveLayout } from "../../hooks";
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
  defaultProps: { section: "body"; preset: "default"; size: "md"; variant: "Default" };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Default";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  defaultTag: "div",
  componentName: "CardSection",
  defaultProps: { section: "body", preset: "default", size: "md", variant: "Default" },
  render: function CardSectionRender({ ref, size: sizeProp, variant: variantProp, ...rest }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
    return <Flex ref={ref} mod={{ size, variant }} {...rest} />;
  },
});
