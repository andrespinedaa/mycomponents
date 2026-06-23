import type {
  ComponentConfig,
  EmptyStatics,
} from "../../../factory/factories.types";
import { PolymorphicFactory } from "../../../factory/PolymorphicFactory";

export type StackConfig = ComponentConfig<{
  componentName: "Stack";
  defaultTag: "div";
  ownProps: {};
  statics: EmptyStatics;
  defaultsProps: { gap: "md" };
}>;

export const Stack = PolymorphicFactory<StackConfig>({
  componentName: "Stack",
  defaultTag: "div",
  defaultProps: { gap: "md" },
});
