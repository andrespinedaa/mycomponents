import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants } from "../../../theme";

export interface TextOwnProps {}

export type TextConfig = ComponentConfig<{
  componentName: "Text";
  defaultTag: "p";
  ownProps: TextOwnProps;
  defaultProps: { m: "0" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: ComponentVariants;
}>;

export const Text = ComponentFactory<TextConfig>({
  render: "p",
  componentName: "Text",
  defaultProps: { m: "0" },
});
