import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Layout, type LayoutConfig } from "../Primitives/Box/Layout";

export interface BadgeOwnProps {}

export type BadgeConfig = ComponentConfig<{
  name: "Badge";
  ownProps: BadgeOwnProps;
  tag: LayoutConfig["tag"];
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Subtle" | "Outlined";
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  name: "Badge",
  render: ({ ref, ...rest }) => <Layout ref={ref} {...rest} />,
});
