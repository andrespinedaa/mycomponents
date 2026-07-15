import type { ThemeComponentConfig } from "../../../theme";
import type { ImgConfig } from "./Image";

export type ImageTheme = ThemeComponentConfig<ImgConfig>;

export const ImageThemeComponent: ImageTheme = {
  presets: {
    cover: {
      w: "100%",
      h: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
};
