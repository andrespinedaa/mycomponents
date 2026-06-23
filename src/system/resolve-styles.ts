import type { CSSProperties } from "react";
import type { Apply, CSSVars } from "../factory/factories.types";
import type { Theme } from "../theme/theme.types";
import { parseStyleProps } from "./parse-style-props";
import type { StyleProps } from "../theme/generators/system-css.data";
import { resolveMacros } from "./parse-macros";

interface ResolveStylesOptions {
  styleProps: StyleProps;
  vars?: CSSVars;
  style?: CSSProperties;
  extraStyle?: CSSProperties;
  unstyled?: boolean;
  apply?: Apply | Apply[];
  /**
   * theme se recibe como parámetro explícito — NUNCA se resuelve con useTheme()
   * dentro de esta función. resolvedStyles puede invocarse desde un closure
   * (getStyle) que el consumidor llama condicionalmente o fuera del render
   * (event handlers, efectos) — llamar un hook ahí rompería las reglas de
   * hooks. El componente que SÍ está en contexto React resuelve theme una
   * sola vez con useTheme() y lo pasa hacia abajo como dato.
   */
  theme: Theme;
}

export interface ResolvedStylesResult {
  styles: CSSProperties | undefined;
  /** true si alguna StyleProp generó CSS vars por breakpoint */
  hasResponsive: boolean;
}

export function resolvedStyles({
  styleProps,
  vars,
  style,
  extraStyle,
  unstyled = false,
  apply,
  theme,
}: ResolveStylesOptions): ResolvedStylesResult {
  const macroStyles = resolveMacros(apply, theme.macros);
  const { styles: systemStyles, hasResponsive } = unstyled
    ? { styles: {}, hasResponsive: false }
    : parseStyleProps(styleProps, theme);

  const merged: CSSProperties = {
    ...macroStyles,
    ...systemStyles,
    ...vars,
    ...style,
    ...extraStyle,
  };

  return {
    styles: Object.keys(merged).length > 0 ? merged : undefined,
    hasResponsive,
  };
}
