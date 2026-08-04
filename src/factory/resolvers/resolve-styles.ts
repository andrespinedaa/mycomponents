import type { CSSProperties } from "react";
import type { ApplyProp, StyleProp } from "../factories.types";
import { type Theme, type StyleProps, type VarsCss, CSS_PROP_TO_CATEGORY } from "../../theme";
import { parseStyleProps } from "../parsers/parse-style-props";
import { resolveMacros } from "../parsers/parse-macros";
import { resolveValue } from "./resolve-value";

interface ResolveStylesOptions {
  styleProps: StyleProps;
  theme: Theme;
  tokenVars: VarsCss;
  vars?: VarsCss;
  style?: CSSProperties;
  unstyled?: boolean;
  apply?: ApplyProp | ApplyProp[];
}

interface ResolvedStylesResult {
  styles: CSSProperties | undefined;
  hasResponsive: boolean;
}

export function resolveStyle(
  theme: Theme,
  style: StyleProp | undefined,
  tokenVars: Record<string, string>,
): CSSProperties | undefined {
  if (!style) return undefined;
  const css = typeof style === "function" ? style(theme) : style;
  const result: CSSProperties = {};
  for (const [key, value] of Object.entries(css)) {
    if (value == null) continue;
    const category = CSS_PROP_TO_CATEGORY[key];
    (result as Record<string, unknown>)[key] = category
      ? resolveValue(value as string | number, category, tokenVars)
      : value;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export function resolveSystemStyles({
  vars,
  style,
  apply,
  theme,
  tokenVars,
  styleProps,
  unstyled = false,
}: ResolveStylesOptions): ResolvedStylesResult {
  const macroStyles = resolveMacros(apply, theme.macros);
  const { styles: systemStyles, hasResponsive } = unstyled
    ? { styles: {}, hasResponsive: false }
    : parseStyleProps(styleProps, tokenVars);

  return {
    styles: { ...macroStyles, ...systemStyles, ...vars, ...style },
    hasResponsive,
  };
}
