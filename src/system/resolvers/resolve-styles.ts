import type { CSSProperties } from "react";
import type { ApplyProp, VarsProp, StyleProp } from "../../factory/factories.types";
import { type Theme, type StyleProps, CSS_PROP_TO_CATEGORY } from "../../theme";
import { parseStyleProps } from "../parse-style-props";
import { resolveMacros } from "../parse-macros";
import { resolveValue } from "./resolve-value";

interface ResolveStylesOptions {
  styleProps: StyleProps;
  theme: Theme;
  vars?: VarsProp;
  style?: CSSProperties;
  unstyled?: boolean;
  apply?: ApplyProp | ApplyProp[];
}

interface ResolvedStylesResult {
  styles: CSSProperties | undefined;
  hasResponsive: boolean;
}

export function resolveStyle(theme: Theme, style?: StyleProp): CSSProperties | undefined {
  if (!style) return undefined;
  const css = typeof style === "function" ? style(theme) : style;
  const result: CSSProperties = {};
  for (const [key, value] of Object.entries(css)) {
    if (value == null) continue;
    const category = CSS_PROP_TO_CATEGORY[key];
    (result as Record<string, unknown>)[key] = category
      ? resolveValue(value as string | number, category, theme)
      : value;
  }
  return result;
}

export function resolveSystemStyles({
  vars,
  style,
  apply,
  theme,
  styleProps,
  unstyled = false,
}: ResolveStylesOptions): ResolvedStylesResult {
  const macroStyles = resolveMacros(apply, theme.macros);
  const { styles: systemStyles, hasResponsive } = unstyled
    ? { styles: {}, hasResponsive: false }
    : parseStyleProps(styleProps, theme);

  const stylesMerged: CSSProperties = {
    ...macroStyles,
    ...systemStyles,
    ...vars,
    ...style,
  };

  return {
    styles: stylesMerged,
    hasResponsive,
  };
}
