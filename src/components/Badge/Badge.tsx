import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type FactoryRender } from "../../factory";
import type { StyleProps } from "../../theme";
import { Box } from "../Primitives/Box";

export interface DotBadgeOwnProps {
  dotColor?: StyleProps["bg"];
}

export type DotBadgeConfig = ComponentConfig<{
  defaultProps: {};
  defaultTag: "span";
  componentName: "DotBadge";
  ownProps: DotBadgeOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export const DotBadge = ComponentFactory<DotBadgeConfig>({
  componentName: "DotBadge",
  render: function DotBadgeRender({ dotColor, ref, variant, size, ...rest }) {
    return (
      <Box
        ref={ref}
        mod={{ variant, size }}
        bg={dotColor}
        vars={dotColor ? { "--dot-color": dotColor } : undefined}
        {...rest}
      />
    );
  },
});

export interface BadgeOwnProps {
  dotIcon?: FactoryRender<{
    size: BadgeConfig["sizes"];
  }>;
}

export type BadgeConfig = ComponentConfig<{
  componentName: "Badge";
  defaultTag: "span";
  ownProps: BadgeOwnProps;
  defaultProps: {};
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Subtle" | "Outlined";
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  render: function BadgeRender({ ref, layoutCtx, set, size, dotIcon, children, variant, ...rest }) {
    return (
      <LayoutProvider value={layoutCtx}>
        <Box ref={ref} mod={{ size, variant, set }} {...rest}>
          {children}
        </Box>
      </LayoutProvider>
    );
  },
});
