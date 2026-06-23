import {
  PolymorphicFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  componentName: "Image";
  defaultTag: "img";
  ownProps: ImageProps;
  statics: EmptyStatics;
  defaultProps: {};
}>;

export const Image = PolymorphicFactory<ImgConfig>({
  componentName: "Image",
  defaultTag: "img",
});
