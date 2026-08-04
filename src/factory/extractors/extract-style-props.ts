import { type StyleProps, STYLE_PROPS_KEYS } from "../../theme/generators";

export type ExtractedStyleProps = {
  styleProps: StyleProps;
  elementProps: Record<string, unknown>;
};

export function extractStyleProps(props: Record<string, unknown>): ExtractedStyleProps {
  const styleProps = {} as StyleProps;
  const elementProps = {} as Record<string, unknown>;

  for (const [key, value] of Object.entries(props)) {
    if (STYLE_PROPS_KEYS.has(key)) {
      (styleProps as Record<string, unknown>)[key] = value;
    } else {
      (elementProps as Record<string, unknown>)[key] = value;
    }
  }

  return { styleProps, elementProps } as ExtractedStyleProps;
}
