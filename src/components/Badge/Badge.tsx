import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import type { SystemVariants } from "../../theme/theme.variants";
import { Box } from "../Primitives/Box";

export interface BadgeOwnProps {
  variant?: SystemVariants<"Filled" | "Subtle" | "Outlined">;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export type BadgeConfig = ComponentConfig<{
  componentName: "Badge";
  defaultTag: "span";
  ownProps: BadgeOwnProps;
  statics: EmptyStatics;
  defaultProps: { variant: "Filled"; size: "md" };
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  defaultTag: "span",
  defaultProps: { variant: "Filled", size: "md" },
  render: ({ variant: _variant, size: _size, dot, children, ref, theme: _t, hooks: _h, ...rest }) => (
    <Box
      as="span"
      ref={ref}
      display="inline-flex"
      align="center"
      fontWeight={600}
      {...rest}
    >
      {dot && (
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </Box>
  ),
});
