import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Box/Layout";

export type CardSectionSets = "cover" | "top" | "bottom" | "gradient" | "background";
export type CardSlots = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: LayoutConfig["defaultTag"];
  ownProps: CardSectionOwnProps;
  slots: Record<CardSlots, CardSectionSets>;
  defaultProps: { slots: "body" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  componentName: "CardSection",
  defaultProps: { slots: "body" },
  render: ({ ref, ...rest }) => <Layout ref={ref} {...rest} />,
});
