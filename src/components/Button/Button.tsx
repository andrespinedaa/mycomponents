import { ComponentFactory, type ComponentConfig } from "../../factory";
import { useResolveLayout } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {}

export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  defaultProps: { size: "md"; variant: "Filled" };
  variants: "Elevated" | "Filled" | "Outlined" | "Ghost";
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  defaultProps: { size: "md", variant: "Filled" },
  render: function ButtonRender({ size: sizeProp, variant: variantProp, ref, ...rest }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
    return <Box ref={ref} mod={{ size, variant }} {...rest} />;
  },
});
