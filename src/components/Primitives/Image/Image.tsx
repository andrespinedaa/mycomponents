import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { Scales } from "../../../theme";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  componentName: "Image";
  defaultTag: "img";
  ownProps: ImageProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: Scales;
}>;

export const Image = ComponentFactory<ImgConfig>({
  componentName: "Image",
  defaultTag: "img",
});
