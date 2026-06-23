import type { Variant } from "../../theme/theme.variants";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {
  variant?: Variant<"Elevated" | "Filled" | "Outlined">;
}
export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  statics: EmptyStatics;
  defaultProps: {};
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  render: (resolvedProps) => <Box {...resolvedProps} />,
});

Button.displayName = "Button";
