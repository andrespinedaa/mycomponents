import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, ThemeFontSizes } from "../../../theme";

export interface TextOwnProps {}

export type TextConfig = ComponentConfig<{
  tag: "p";
  name: "Text";
  ownProps: TextOwnProps;
  variants: ComponentVariants;
  sizes: keyof ThemeFontSizes;
}>;

export const Text = ComponentFactory<TextConfig>({ render: "p", name: "Text" });
