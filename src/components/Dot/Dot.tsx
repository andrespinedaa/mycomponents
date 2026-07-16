import { ComponentFactory, type ComponentConfig } from "../../factory";
import type { StyleProps } from "../../theme";
import { Box, type BoxConfig } from "../Primitives";

export interface DotOwnProps {
  dotColor?: StyleProps["bg"];
}

export type DotConfig = ComponentConfig<{
  defaultProps: {};
  defaultTag: BoxConfig["defaultTag"];
  componentName: "Dot";
  ownProps: DotOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
}>;

export const Dot = ComponentFactory<DotConfig>({
  componentName: "Dot",
  render: ({ dotColor, ...rest }) => <Box bg={dotColor} {...rest} />,
});
