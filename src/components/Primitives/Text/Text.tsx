import {
  ComponentFactory,
  type ComponentConfig
} from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface TextOwnProps { }

export type TextConfig = ComponentConfig<{
  componentName: "Text";
  defaultTag: "p";
  ownProps: TextOwnProps;
  defaultProps: {};
  sizes: Scales;
  variants: ComponentVariants;
}>;

export const Text = ComponentFactory<TextConfig>({
  componentName: "Text",
  render: "p"
});
