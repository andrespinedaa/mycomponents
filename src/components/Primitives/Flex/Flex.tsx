import type {
  ComponentConfig,
  EmptyStatics,
} from "../../../factory/factories.types";
import { PolymorphicFactory } from "../../../factory/PolymorphicFactory";

export type FlexConfig = ComponentConfig<{
  componentName: "Flex";
  defaultTag: "div";
  ownProps: {};
  statics: EmptyStatics;
  defaultsProps: {};
}>;

export const Flex = PolymorphicFactory<FlexConfig>({
  componentName: "Flex",
  defaultTag: "div",
});
