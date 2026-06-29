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
  /** Corta el texto con ellipsis en una sola línea. Activa @truncate. */
  truncate?: boolean;
  /** Limita el texto a N líneas con ellipsis. Activa @lineClamp. */
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
  render: ({ size, weight, truncate, lineClamp, apply, children, ref, theme: _t, hooks: _h, ...rest }) => {
    const macros = [
      ...(Array.isArray(apply) ? apply : apply ? [apply] : []),
      ...(truncate              ? ["@truncate"]  : []),
      ...(lineClamp             ? ["@lineClamp"] : []),
    ];

    return (
      <Box
        ref={ref}
        fontSize={size}
        fontWeight={weight}
        apply={macros as any}
        vars={lineClamp ? { "--line-clamp": String(lineClamp) } : undefined}
        {...rest}
      >
        {children}
      </Box>
    );
  },
});
