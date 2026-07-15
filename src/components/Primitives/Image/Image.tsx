import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants } from "../../../theme";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  componentName: "Image";
  defaultTag: "img";
  ownProps: ImageProps;
  defaultProps: {};
  presets: "cover";
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: ComponentVariants;
}>;

export const Image = ComponentFactory<ImgConfig>({
  render: "img",
  componentName: "Image",
});
