import type { CSSProperties } from "react";
import type { ApplyProp, VarsProp } from "../factory/factories.types";
import type { Theme } from "../theme/theme.types";
import { parseStyleProps } from "./parse-style-props";
import type { StyleProps } from "../theme/generators/system-css.data";
import { resolveMacros } from "./parse-macros";

interface ResolveStylesOptions {
  styleProps: StyleProps;
  theme: Theme;
  vars?: VarsProp;
  style?: CSSProperties;
  extraStyle?: CSSProperties;
  unstyled?: boolean;
  apply?: ApplyProp | ApplyProp[];
}

export interface ResolvedStylesResult {
  styles: CSSProperties | undefined;
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
