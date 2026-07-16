import { ComponentFactory, type ComponentConfig, type FactoryRender } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Box/Layout";

export interface BadgeOwnProps {
  dotIcon?: FactoryRender<{
    size: BadgeConfig["sizes"];
  }>;
}

export type BadgeConfig = ComponentConfig<{
  componentName: "Badge";
  defaultTag: LayoutConfig["defaultTag"];
  ownProps: BadgeOwnProps;
  defaultProps: {};
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Subtle" | "Outlined";
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  render: (props) => <Layout {...props} />,
});
