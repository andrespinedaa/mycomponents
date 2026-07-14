import {
  ComponentFactory,
  type ComponentConfig,
} from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface BoxProps {}

export type BoxConfig = ComponentConfig<{
  componentName: "Box";
  defaultTag: "div";
  ownProps: BoxProps;
  defaultProps: {};
  sizes: Scales;
  variants: ComponentVariants; 
}>;

export const Box = ComponentFactory<BoxConfig>({
  componentName: "Box",
  defaultTag: "div",
});
