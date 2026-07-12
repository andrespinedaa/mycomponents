import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useResolveLayout } from "../../hooks";
import type { StylePropsTokens } from "../../theme";
import { Flex } from "../Primitives";

export type CardSectionSets = "background" | "top" | "gradient";
export type CardSectionMediaSets = "top" | "bottom" | "background";
export type CardSectionHeaderSets = "static" | "underground";
export type CardSectionFooterSets = "static" | "undergorund";
export type CardSectionBodySets = "compact";
export type CardSections = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

type SectionEntry<Sets extends string> = StylePropsTokens & Partial<Record<Sets, StylePropsTokens>>;

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  statics: EmptyStatics;
  sections: {
    media:  SectionEntry<CardSectionMediaSets>;
    header: SectionEntry<CardSectionHeaderSets>;
    footer: SectionEntry<CardSectionFooterSets>;
    body:   SectionEntry<CardSectionBodySets>;
  };
  defaultProps: { section: "body"; size: "md"; variant: "Default" };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Default";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  defaultTag: "div",
  componentName: "CardSection",
  defaultProps: { section: "body", size: "md", variant: "Default" },
  render: function CardSectionRender({ ref, size: sizeProp, variant: variantProp, ...rest }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
    return <Flex ref={ref} mod={{ size, variant }} {...rest} />;
  },
});
