import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface FlexOwnProps {}

export type FlexConfig = ComponentConfig<{
  componentName: "Flex";
  defaultTag: "div";
  ownProps: FlexOwnProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: Scales;
  presets: string;
  variants: ComponentVariants;
}>;

export const Flex = ComponentFactory<FlexConfig>({
  defaultTag: "div",
  componentName: "Flex",
});
