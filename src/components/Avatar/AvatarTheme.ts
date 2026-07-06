import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { AvatarConfig } from "./Avatar";

export type AvatarThemeConfig = ThemeComponentConfig<AvatarConfig>;

export const AvatarThemeComponent: AvatarThemeConfig = {
  prefix: "avatar",
  sizes: {
    xs: { w: "xs", h: "xs", fontSize: "xs" },
    sm: { w: "sm", h: "sm", fontSize: "sm" },
    md: { w: "md", h: "md", fontSize: "md" },
    lg: { w: "lg", h: "lg", fontSize: "lg" },
    xl: { w: "xl", h: "xl", fontSize: "xl" },
  },
};
