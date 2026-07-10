import { useLayoutContext } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { Flex } from "../Primitives";

export type CardSectionSets = "default" | "background" | "top" | "gradient";
export type SlotsCardSection = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {
  section?: SlotsCardSection;
  preset?: CardSectionSets;
}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  statics: EmptyStatics;
  defaultProps: { section: "body"; preset: "default" };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  defaultTag: "div",
  componentName: "CardSection",
  defaultProps: { section: "body", preset: "default" },
  render: function CardSectionRender({ section, preset, ref, ...rest }) {
    const { size } = useLayoutContext();
    return <Flex ref={ref} mod={{ section, preset, size }} {...rest} />;
  },
});
