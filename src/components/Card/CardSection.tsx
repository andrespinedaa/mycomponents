import { ComponentFactory, type ComponentConfig } from "../../factory";
import { useResolveLayout } from "../../hooks";
import { Flex } from "../Primitives";

export type CardSectionSets = "cover" | "alignTop" | "gradient";
export type CardSectionMediaSets = "alignTop" | "alignBottom" | "cover";
export type CardSectionHeaderSets = "static" | "underground";
export type CardSectionFooterSets = "static" | "undergorund";
export type CardSectionBodySets = "compact";
export type CardSections = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  sections: {
    media: CardSectionMediaSets;
    header: CardSectionHeaderSets;
    footer: CardSectionFooterSets;
    body: CardSectionBodySets;
  };
  defaultProps: { section: "body"; variant: "Filled" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  defaultTag: "div",
  componentName: "CardSection",
  defaultProps: { section: "body", variant: "Filled" },
  render: function CardSectionRender({
    ref,
    set,
    section,
    size: _size,
    variant: _variant,
    ...rest
  }) {
    const { size, variant } = useResolveLayout({ size: _size, variant: _variant });
    return <Flex ref={ref} {...rest} mod={{ size, variant, section, set }} />;
  },
});
