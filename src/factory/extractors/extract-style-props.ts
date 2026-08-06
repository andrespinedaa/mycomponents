import { type StyleProps, STYLE_PROPS_KEYS } from "../../theme/generators";

export type ExtractedStyleProps = {
  styleProps: StyleProps;
  elementProps: Record<string, unknown>;
};

export function extractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const styleProps: Record<string, unknown> = {};
  const elementProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (STYLE_PROPS_KEYS.has(key)) {
      styleProps[key] = value;
    } else {
      elementProps[key] = value;
    }
  }

  return { styleProps, elementProps } as ExtractedStyleProps;
}
