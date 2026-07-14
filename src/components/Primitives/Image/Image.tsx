import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  componentName: "Image";
  defaultTag: "img";
  ownProps: ImageProps;
  defaultProps: {};
  sizes: Scales;
  variants: ComponentVariants;
}>;

export const Image = ComponentFactory<ImgConfig>({
  defaultTag: "img",
  componentName: "Image",
});
