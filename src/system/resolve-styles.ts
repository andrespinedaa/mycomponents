import type { CSSProperties } from "react";
import type { ApplyProp, VarsProp, StyleProp } from "../factory/core/factories.types";
import { type Theme, type StyleProps, CSS_PROP_TO_CATEGORY } from "../theme";
import { parseStyleProps } from "./parse-style-props";
import { resolveMacros } from "./parse-macros";
import { resolveValue } from "./resolve-value";

// Resuelve un StyleProp (objeto o función) a CSSProperties con valores reales del tema.
// Si es función, la llama con el tema primero; luego resuelve token strings por propiedad.
export function resolveStyle(style: StyleProp | undefined, theme: Theme): CSSProperties | undefined {
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
  return Object.keys(result).length > 0 ? result : undefined;
}

interface ResolveStylesOptions {
  styleProps: StyleProps;
  theme: Theme;
  vars?: VarsProp;
  style?: CSSProperties;
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
  };

  return {
    styles: Object.keys(merged).length > 0 ? merged : undefined,
    hasResponsive,
  };
}
