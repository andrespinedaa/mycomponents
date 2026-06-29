import type { SystemVariants } from "../../theme/theme.variants";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {
  variant?: SystemVariants<"Elevated" | "Filled" | "Outlined" | "Ghost">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  statics: EmptyStatics;
  defaultProps: { size: "md" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  render: ({ ref, theme: _t, hooks: _h, ...rest }) => <Box ref={ref} {...rest} />,
});

Button.displayName = "Button";
