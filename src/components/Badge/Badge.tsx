import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import type { Variant } from "../../theme/theme.variants";
import { Box } from "../Primitives/Box";

export interface BadgeOwnProps {
  variant?: Variant<"Filled" | "Subtle" | "Outlined">;
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

const SIZE_STYLES = {
  sm: { px: "xs" as const, fontSize: "xs" as const, h: "xs" as const },
  md: { px: "sm" as const, fontSize: "sm" as const, h: "sm" as const },
  lg: { px: "md" as const, fontSize: "md" as const, h: "md" as const },
};

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  defaultTag: "span",
  defaultProps: { variant: "Filled", size: "md" },
  render: ({ variant: _variant, size = "md", dot, children, ...rest }) => {
    const sz = SIZE_STYLES[size];
    return (
      <Box
        as="span"
        display="inline-flex"
        align="center"
        gap="xs"
        rounded="full"
        fontWeight={600}
        {...sz}
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
    );
  },
});
