// src/components/Box/Box.utils.ts
import type { CSSProperties } from "react";
import { parseStyleProps } from "../system/extract-style-props";
import type { StyleProps } from "../system/style-props.types";
import type { Theme } from "../theme/types";
import type { CSSVars } from "../factory/factory.types";

interface ResolveStylesOptions {
  styleProps: StyleProps;
  vars?: CSSVars;
  style?: CSSProperties;
  theme: Theme;
  extraStyle?: CSSProperties;
  unstyled?: boolean;
}

export function resolvedStyles({
  styleProps,
  vars,
  style,
  theme,
  extraStyle,
  unstyled = false,
}: ResolveStylesOptions): CSSProperties | undefined {

  const systemStyles = unstyled ? {} : parseStyleProps(styleProps, theme);

  const merged: CSSProperties = {
    ...systemStyles,
    ...vars,
    ...style,
    ...extraStyle,
  };

  return Object.keys(merged).length > 0 ? merged : undefined;
}