import type { ThemeComponentConfig } from "../../theme/theme.components.types";
import type { AvatarConfig } from "./Avatar";

type AvatarThemeConfig = ThemeComponentConfig<AvatarConfig>;

export const AvartarThemeComponent: AvatarThemeConfig = {
  prefix: "avatar",
  defaultProps: { shape: "circle", size: "md" },
  sizes: {
    xs: { w: "xs", h: "xs", fontSize: "xs" },
    sm: { w: "sm", h: "sm", fontSize: "sm" },
    md: { w: "md", h: "md", fontSize: "md" },
    lg: { w: "lg", h: "lg", fontSize: "lg" },
    xl: { w: "xl", h: "xl", fontSize: "xl" },
  },
};
