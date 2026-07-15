import type { ThemeComponentConfig } from "../../../theme";
import type { ImgConfig } from "./Image";

export type ImageTheme = ThemeComponentConfig<ImgConfig>;

export const ImageThemeComponent: ImageTheme = {
  // Image no tiene tamaño propio hoy — se dimensiona por el contenedor (Card, CardSection) o por `cover`.
  // Placeholders vacíos para cumplir el contrato de `sizes` requerido.
  sizes: {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
  },
  presets: {
    cover: {
      w: "100%",
      h: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
};
