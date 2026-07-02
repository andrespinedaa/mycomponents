import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { Scales } from "../../../theme";

export interface FlexOwnProps {}

export type FlexConfig = ComponentConfig<{
  componentName: "Flex";
  defaultTag: "div";
  ownProps: FlexOwnProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: Scales;
}>;

export const Flex = ComponentFactory<FlexConfig>({
  componentName: "Flex",
  defaultTag: "div",
});
