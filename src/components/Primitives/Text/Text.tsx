import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { FontSizeValue } from "../../../theme/generators/system-css.data";
import { Box } from "../Box";

export interface TextOwnProps {
  size?: FontSizeValue;
  weight?: React.CSSProperties["fontWeight"];
  truncate?: boolean;
  lineClamp?: number;
}

export type TextConfig = ComponentConfig<{
  componentName: "Text";
  defaultTag: "p";
  ownProps: TextOwnProps;
  statics: EmptyStatics;
  defaultProps: {};
}>;

export const Text = ComponentFactory<TextConfig>({
  componentName: "Text",
  defaultTag: "p",
  render: ({ size, weight, truncate, lineClamp, apply, children, ...rest }, ref) => {
    const applyMacros: string[] = Array.isArray(apply)
      ? [...apply]
      : apply
      ? [apply]
      : [];

    if (truncate) applyMacros.push("@truncate");

    const extraStyle: React.CSSProperties = {};
    if (lineClamp) {
      applyMacros.push("@lineClamp");
      extraStyle.WebkitLineClamp = lineClamp;
    }

    return (
      <Box
        ref={ref}
        fontSize={size}
        fontWeight={weight}
        apply={applyMacros as any}
        style={Object.keys(extraStyle).length ? extraStyle : undefined}
        {...rest}
      >
        {children}
      </Box>
    );
  },
});
