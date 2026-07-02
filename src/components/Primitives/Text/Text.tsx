import {
  ComponentFactory,
  type ApplyProp,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { Scales } from "../../../theme";
import { Box } from "../Box";

export interface TextOwnProps {
  weight?: React.CSSProperties["fontWeight"];
  truncate?: boolean;
  lineClamp?: number;
}

export type TextConfig = ComponentConfig<{
  componentName: "Text";
  defaultTag: "p";
  ownProps: TextOwnProps;
  statics: EmptyStatics;
  defaultProps: {
    size: "md";
  };
  sizes: Scales;
}>;

export const Text = ComponentFactory<TextConfig>({
  componentName: "Text",
  defaultTag: "p",
  defaultProps: { size: "md" },
  render: function TextRender({
    size,
    weight,
    truncate,
    lineClamp,
    apply,
    children,
    ref,
    ...rest
  }) {
    const macros = [
      ...(Array.isArray(apply) ? apply : apply ? [apply] : []),
      ...(truncate ? ["@truncate"] : []),
      ...(lineClamp ? ["@lineClamp"] : []),
    ];

    return (
      <Box
        ref={ref}
        fontWeight={weight}
        apply={macros as ApplyProp[]}
        vars={lineClamp ? { "--line-clamp": String(lineClamp) } : undefined}
        {...rest}
      >
        {children}
      </Box>
    );
  },
});
