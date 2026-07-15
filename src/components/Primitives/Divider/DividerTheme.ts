import type { ThemeComponentConfig } from "../../../theme";
import type { DividerConfig } from "./Divider"

export type DividerThemeComponent = ThemeComponentConfig<DividerConfig>;

export const DividerTheme: DividerThemeComponent = {
  // `thickness` hoy se controla vía prop (--divider-thickness inline), no vía [data-size] —
  // placeholders vacíos para cumplir el contrato de `sizes` requerido.
  sizes: {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
  },
};