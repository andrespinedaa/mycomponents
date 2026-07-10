import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useResolvedSize } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {}

export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  statics: EmptyStatics;
  defaultProps: { size: "md"; variant: "Default" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: string;
  variants: "Elevated" | "Filled" | "Outlined" | "Ghost" | "Default";
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  defaultProps: { size: "md", variant: "Default" },
  render: function ButtonRender({ size, variant, ref, ...rest }) {
    const resolvedSize = useResolvedSize(size);
    return <Box ref={ref} mod={{ size: resolvedSize, variant }} {...rest} />;
  },
});
