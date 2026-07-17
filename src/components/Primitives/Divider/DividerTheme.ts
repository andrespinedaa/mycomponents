import type { ThemeComponentConfig } from "../../../theme";
import type { DividerConfig } from "./Divider"

export type DividerThemeComponent = ThemeComponentConfig<DividerConfig>;

export const DividerTheme: DividerThemeComponent = {
  sizes: {
    xs: { flex: "1", h: "2px" },
    sm: { flex: "1", h: "2px" },
    md: { flex: "1", h: "2px" },
    lg: { flex: "1", h: "2px" },
    xl: { flex: "1", h: "2px" },
  },

  variants: {
    display: "flex",
    align: "center",
    gap: "sm",
    bg: "neutral.500"
  }
};