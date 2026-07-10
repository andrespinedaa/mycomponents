import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface BoxProps {}

export type BoxConfig = ComponentConfig<{
  componentName: "Box";
  defaultTag: "div";
  ownProps: BoxProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: Scales;
  presets: string;
  variants: ComponentVariants; 
}>;

export const Box = ComponentFactory<BoxConfig>({
  componentName: "Box",
  defaultTag: "div",
});
