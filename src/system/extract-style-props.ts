import type { ElementType } from "react";
import type { MyComponentProps } from "../factory/core";
import { type StyleProps, STYLE_PROPS_KEYS } from "../theme/generators";

export type ExtractedStyleProps<E extends ElementType, OwnProps extends object> = {
  styleProps: StyleProps;
  componentProps: MyComponentProps<E, OwnProps>;
};

export function extractStyleProps<E extends ElementType, OwnProps extends object>(
  props: Record<string, unknown>,
): ExtractedStyleProps<E, OwnProps> {
  const styleProps = {} as StyleProps;
  const componentProps = {} as MyComponentProps<E, OwnProps>;

  for (const [key, value] of Object.entries(props)) {
    if (STYLE_PROPS_KEYS.has(key)) {
      (styleProps as Record<string, unknown>)[key] = value;
    } else {
      (componentProps as Record<string, unknown>)[key] = value;
    }
  }

  return { styleProps, componentProps } as ExtractedStyleProps<E, OwnProps>;
}
