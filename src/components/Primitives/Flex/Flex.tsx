import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface FlexOwnProps {}

export type FlexConfig = ComponentConfig<{
  componentName: "Flex";
  defaultTag: "div";
  ownProps: FlexOwnProps;
  defaultProps: {};
  sizes: Scales;
  variants: ComponentVariants;
}>;

export const Flex = ComponentFactory<FlexConfig>({
  render: "div",
  componentName: "Flex",
  defaultProps: {
    display: "flex",
  },
});
