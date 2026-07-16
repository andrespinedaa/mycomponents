import { ComponentFactory, type ComponentConfig, type FactoryRender } from "../../factory";
import type { StyleProps } from "../../theme";
import { Box, type BoxConfig } from "../Primitives/Box";
import { Layout, type LayoutConfig } from "../Primitives/Box/Layout";

export interface DotBadgeOwnProps {
  dotColor?: StyleProps["bg"];
}

export type DotBadgeConfig = ComponentConfig<{
  defaultProps: {};
  defaultTag: BoxConfig["defaultTag"];
  componentName: "DotBadge";
  ownProps: DotBadgeOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled";
}>;

export const DotBadge = ComponentFactory<DotBadgeConfig>({
  componentName: "DotBadge",
  render: ({ dotColor, ...rest }) => <Box bg={dotColor} vars={dotColor ? { "--dot-color": dotColor } : undefined} {...rest} />
});

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
  render: (props) => <Layout {...props} />
});
