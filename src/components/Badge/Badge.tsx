import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Box/Layout";

export interface BadgeOwnProps {}

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
  render: ({ ref, ...rest }) => <Layout ref={ref} {...rest} />,
});
