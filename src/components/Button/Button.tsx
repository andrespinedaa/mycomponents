import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useResolveLayout } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {}

export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  statics: EmptyStatics;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  defaultProps: { size: "md"; variant: "Default" };
  variants: "Elevated" | "Filled" | "Outlined" | "Ghost" | "Default";
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  defaultProps: { size: "md", variant: "Default" },
  render: function ButtonRender({ size: sizeProp, variant: variantProp, ref, ...rest }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
    return <Box ref={ref} mod={{ size, variant }} {...rest} />;
  },
});
