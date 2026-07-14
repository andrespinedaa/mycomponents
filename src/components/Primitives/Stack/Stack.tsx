import {
  ComponentFactory,
  type ComponentConfig,
} from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme/core/theme.types";

export interface StackOwnProps {}

export type StackConfig = ComponentConfig<{
  componentName: "Stack";
  defaultTag: "div";
  ownProps: StackOwnProps;
  defaultProps: { gap: "md" };
  sizes: Scales;
  variants: ComponentVariants;
}>;

export const Stack = ComponentFactory<StackConfig>({
  defaultTag: "div",
  componentName: "Stack",
  defaultProps: { gap: "md" },
});
