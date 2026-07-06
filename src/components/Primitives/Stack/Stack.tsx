import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { Scales } from "../../../theme/core/theme.types";

export interface StackOwnProps {}

export type StackConfig = ComponentConfig<{
  componentName: "Stack";
  defaultTag: "div";
  ownProps: StackOwnProps;
  statics: EmptyStatics;
  defaultProps: { gap: "md" };
  sizes: Scales;
}>;

export const Stack = ComponentFactory<StackConfig>({
  componentName: "Stack",
  defaultTag: "div",
  defaultProps: { gap: "md" },
});
