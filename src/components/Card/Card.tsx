import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Layout/Layout";
import { CardSection } from "./CardSection";

export interface CardOwnProps {}

export type CardConfig = ComponentConfig<{
  name: "Card";
  tag: LayoutConfig["tag"];
  ownProps: CardOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const Card = Object.assign(
  ComponentFactory<CardConfig>({
    name: "Card",
    render: ({ ref, variant = "Filled", ...rest }) => (
      <Layout variant={variant} ref={ref} {...rest} />
    ),
  }),
  { Section: CardSection },
);
