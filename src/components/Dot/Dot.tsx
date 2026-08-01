import { ComponentFactory, type ComponentConfig } from "../../factory";
import type { StyleProps } from "../../theme";
import { Box, type BoxConfig } from "../Primitives";

export interface DotOwnProps {
  dotColor?: StyleProps["bg"];
}

export type DotConfig = ComponentConfig<{
  name: "Dot";
  tag: BoxConfig["tag"];
  ownProps: DotOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
}>;

export const Dot = ComponentFactory<DotConfig>({
  name: "Dot",
  render: ({ ref, dotColor, ...rest }) => <Box ref={ref} bg={dotColor} {...rest} />,
});
