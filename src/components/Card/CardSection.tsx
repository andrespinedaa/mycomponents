import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Layout/Layout";

export type CardSectionSets = "cover" | "top" | "bottom" | "gradient" | "background";
export type CardSlots = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

export type CardSectionConfig = ComponentConfig<{
  name: "CardSection";
  presets: CardSectionSets;
  tag: LayoutConfig["tag"];
  ownProps: CardSectionOwnProps;
  slots: Record<CardSlots, CardSectionSets>;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  name: "CardSection",
  render: ({ ref, slots = "body", ...rest }) => <Layout slots={slots} ref={ref} {...rest} />,
});
