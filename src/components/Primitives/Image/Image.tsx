import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants } from "../../../theme";

export interface ImageProps {}

export type ImgConfig = ComponentConfig<{
  tag: "img";
  name: "Image";
  presets: "cover";
  ownProps: ImageProps;
  variants: ComponentVariants;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export const Image = ComponentFactory<ImgConfig>({ render: "img", name: "Image" });
