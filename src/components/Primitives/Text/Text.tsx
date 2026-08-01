import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants } from "../../../theme";

export interface TextOwnProps {}

export type TextConfig = ComponentConfig<{
  tag: "p";
  name: "Text";
  ownProps: TextOwnProps;
  variants: ComponentVariants;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export const Text = ComponentFactory<TextConfig>({ render: "p", name: "Text" });
