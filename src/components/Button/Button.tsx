import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import type { ScaleRange, SystemVariants } from "../../theme";
import { useResolvedSize } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface ButtonOwnProps {
  variant?: SystemVariants<"Elevated" | "Filled" | "Outlined" | "Ghost">;
}
export type ButtonConfig = ComponentConfig<{
  componentName: "Button";
  defaultTag: "button";
  ownProps: ButtonOwnProps;
  statics: EmptyStatics;
  defaultProps: { size: "md" };
  sizes: ScaleRange<"xs" | "sm" | "md" | "lg" | "xl">;
  presets: string;
  slots: ""
}>;

export const Button = ComponentFactory<ButtonConfig>({
  componentName: "Button",
  defaultTag: "button",
  defaultProps: { size: "md" },
  render: function ButtonRender({ size, variant, ref, ...rest }) {
    const resolvedSize = useResolvedSize(size);
    return <Box ref={ref} mod={{ size: resolvedSize, variant }} {...rest} />;
  },
});
