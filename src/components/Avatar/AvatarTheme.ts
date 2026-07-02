import type { ThemeComponentConfig } from "../../theme/theme.components.types";
import type { AvatarConfig } from "./Avatar";

export type AvatarThemeConfig = ThemeComponentConfig<AvatarConfig>;

export const AvatarThemeComponent: AvatarThemeConfig = {
  prefix: "avatar",
  defaultProps: {
    shape: "circle",
    size: "md",
    display: "inline-flex",
    overflow: "hidden",
    flexShrink: 0,
    userSelect: "none",
  },
  sizes: {
    xs: { w: "xs", h: "xs", fontSize: "xs" },
    sm: { w: "sm", h: "sm", fontSize: "sm" },
    md: { w: "md", h: "md", fontSize: "md" },
    lg: { w: "lg", h: "lg", fontSize: "lg" },
    xl: { w: "xl", h: "xl", fontSize: "xl" },
  },
};
