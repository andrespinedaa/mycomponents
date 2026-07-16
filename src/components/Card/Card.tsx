import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout } from "../Primitives/Box/Layout";
import { CardSection } from "./CardSection";

export interface CardOwnProps {}

export type CardConfig = ComponentConfig<{
  defaultTag: "div";
  componentName: "Card";
  ownProps: CardOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  statics: { Section: typeof CardSection };
  variants: "Filled" | "Elevated" | "Outlined";
  defaultProps: { orientation: "vertical", variant: "Filled" };
}>;

export const Card = ComponentFactory<CardConfig>({
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: { orientation: "vertical", variant: "Elevated" },
  render: (props) => <Layout {...props} />
});
