import type { CSSProperties } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { FontSizeValue } from "../../../theme/generators/system-css.data";
import { Box } from "../Box";

export interface TextOwnProps {
  size?: FontSizeValue;
  weight?: CSSProperties["fontWeight"];
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
  render: ({ size, weight, truncate, lineClamp, style, children, ...rest }, ref) => {
    const extraStyle: CSSProperties = {};
    if (truncate) {
      extraStyle.overflow = "hidden";
      extraStyle.whiteSpace = "nowrap";
      extraStyle.textOverflow = "ellipsis";
    }
    if (lineClamp) {
      extraStyle.display = "-webkit-box";
      extraStyle.WebkitLineClamp = lineClamp;
      extraStyle.WebkitBoxOrient = "vertical";
      extraStyle.overflow = "hidden";
    }
    return (
      <Box
        ref={ref}
        fontSize={size}
        fontWeight={weight}
        style={{ ...extraStyle, ...style }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
});
