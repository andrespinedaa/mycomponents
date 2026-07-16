import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout } from "../Primitives/Box/Layout";

export type CardSectionSets = "cover" | "alignTop" | "gradient";
export type CardSectionMediaSets = "alignTop" | "alignBottom" | "cover";
export type CardSectionHeaderSets = "top" | "bottom";
export type CardSectionFooterSets = "static" | "undergorund";
export type CardSectionBodySets = "compact";
export type CardSlots = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  slots: {
    media: CardSectionMediaSets;
    header: CardSectionHeaderSets;
    footer: CardSectionFooterSets;
    body: CardSectionBodySets;
  };
  defaultProps: { section: "body" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  componentName: "CardSection",
  defaultProps: { section: "body" },
  render: (props) => <Layout {...props} />
});
