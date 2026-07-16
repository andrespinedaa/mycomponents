import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps { }

export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  defaultProps: {}
  variants: "Elevated" | "Filled" | "Outlined" | "Ghost";
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  render: (props) => <Box {...props} />
});
