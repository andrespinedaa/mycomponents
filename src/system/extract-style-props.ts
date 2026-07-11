import type { ElementType } from "react";
import type { MyComponentProps } from "../factory/core";
import { type StyleProps, STYLE_PROPS_KEYS } from "../theme/generators";

export type ExtractedStyleProps<E extends ElementType, OwnProps extends object> = {
  styleProps: StyleProps;
  elementProps: MyComponentProps<E, OwnProps>;
};

export function extractStyleProps<E extends ElementType, OwnProps extends object>(
  props: Record<string, unknown>,
): ExtractedStyleProps<E, OwnProps> {
  const styleProps = {} as StyleProps;
  const elementProps = {} as MyComponentProps<E, OwnProps>;

  for (const [key, value] of Object.entries(props)) {
    if (STYLE_PROPS_KEYS.has(key)) {
      (styleProps as Record<string, unknown>)[key] = value;
    } else {
      (elementProps as Record<string, unknown>)[key] = value;
    }
  }

  return { styleProps, elementProps } as ExtractedStyleProps<E, OwnProps>;
}
