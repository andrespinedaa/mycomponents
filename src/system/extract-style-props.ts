import type { CSSProperties, ElementType } from "react";
import type { ElementProps } from "../factory/factory.types";
import type { Theme } from "../theme/types";
import {
  STYLE_PROPS_DATA,
  STYLE_PROPS_KEYS,
  resolveValue,
} from "./style-props.data";
import type { StyleProps } from "./style-props.types";

export type ExtractedStyleProps<E extends ElementType, OwnProps = object> = {
  styleProps: StyleProps;
  elementProps: ElementProps<E, OwnProps>;
};

// Separa las props del componente en style props y el resto

export function extractStyleProps<E extends ElementType, OwnProps = object>(
  props: Record<string, unknown>,
): ExtractedStyleProps<E, OwnProps> {
  const styleProps = {} as StyleProps;
  const elementProps = {} as ElementProps<E, OwnProps>;

  for (const [key, value] of Object.entries(props)) {
    if (STYLE_PROPS_KEYS.has(key)) {
      (styleProps as Record<string, unknown>)[key] = value;
    } else {
      (elementProps as Record<string, unknown>)[key] = value;
    }
  }

  return { styleProps, elementProps };
}

// Convierte las style props a un objeto CSSProperties
export function parseStyleProps(
  styleProps: StyleProps,
  theme: Theme,
): CSSProperties {
  const result: Record<string, string | number> = {};

  for (const [prop, value] of Object.entries(styleProps)) {
    if (value === undefined || value === null) continue;

    const def = STYLE_PROPS_DATA[prop as keyof StyleProps];
    if (!def) continue;

    const rawValue =
      typeof value === "object" && !Array.isArray(value) && "base" in value
        ? (value as Record<string, unknown>).base
        : value;

    if (rawValue === undefined) continue;

    const resolved = resolveValue(
      rawValue as string | number,
      def.category,
      theme,
    );

    for (const cssProp of def.properties) {
      result[cssProp] = resolved;
    }
  }

  return result as CSSProperties;
}
