import type { ThemeComponentConfig } from "../../theme/core/theme.components.types";
import type { AvatarConfig } from "./Avatar";

export type AvatarThemeConfig = ThemeComponentConfig<AvatarConfig>;

export const AvatarThemeComponent: AvatarThemeConfig = {
  sizes: {
    xs: { w: "xs", h: "xs", fontSize: "xs" },
    sm: { w: "sm", h: "sm", fontSize: "sm" },
    md: { w: "md", h: "md", fontSize: "md" },
    lg: { w: "lg", h: "lg", fontSize: "lg" },
    xl: { w: "xl", h: "xl", fontSize: "xl" },
  },

  variants: {
    flexShrink: 0,
    overflow: "hidden",
    userSelect: "none",
    display: "inline-flex",
  }
};
