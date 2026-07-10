import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  componentName: "Image";
  defaultTag: "img";
  ownProps: ImageProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: Scales;
  presets: string;
  variants: ComponentVariants;
}>;

export const Image = ComponentFactory<ImgConfig>({
  defaultTag: "img",
  componentName: "Image",
});
