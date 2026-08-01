import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface BoxProps {}

export type BoxConfig = ComponentConfig<{
  tag: "div";
  name: "Box";
  sizes: Scales;
  ownProps: BoxProps;
  variants: ComponentVariants;
}>;

export const Box = ComponentFactory<BoxConfig>({ render: "div", name: "Box" });
