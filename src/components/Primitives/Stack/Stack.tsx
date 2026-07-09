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
  presets: string;
  slots: ""
}>;

export const Stack = ComponentFactory<StackConfig>({
  defaultTag: "div",
  componentName: "Stack",
  defaultProps: { gap: "md" },
});
