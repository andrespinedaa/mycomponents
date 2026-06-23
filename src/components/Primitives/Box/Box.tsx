import type { EmptyStatics, ComponentConfig } from "../../../factory";
import { PolymorphicFactory } from "../../../factory/PolymorphicFactory";

export interface BoxProps {}

export type BoxConfig = ComponentConfig<{
  componentName: "Box";
  defaultTag: "div";
  ownProps: BoxProps;
  statics: EmptyStatics;
  defaultProps: {};
}>;

export const Box = PolymorphicFactory<BoxConfig>({
  componentName: "Box",
  defaultTag: "div",
});
