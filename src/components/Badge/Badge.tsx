import { useMemo } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
  type FactoryRender,
} from "../../factory";
import type { ScaleRange, SystemVariants } from "../../theme";
import { LayoutProvider, useLayoutContext } from "../../context/LayoutContext";
import { useResolvedSize } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface DotBadgeOwnProps {
  dotColor?: string;
}

export type DotBadgeConfig = ComponentConfig<{
  componentName: "DotBadge";
  defaultTag: "span";
  ownProps: DotBadgeOwnProps;
  statics: EmptyStatics;
  defaultProps: {};
  sizes: ScaleRange<"xs" | "sm" | "md" | "lg">;
  sets: string
}>;

export const DotBadge = ComponentFactory<DotBadgeConfig>({
  componentName: "DotBadge",
  defaultTag: "span",
  defaultProps: {},
  render: function DotBadgeRender({ dotColor, ref, ...rest }) {
    return <Box as="span" ref={ref} vars={dotColor ? { "--dot-color": dotColor } : undefined} {...rest} />;
  },
});

export interface BadgeOwnProps {
  variant?: SystemVariants<"Filled" | "Subtle" | "Outlined">;
  dotIcon?: FactoryRender<{
    size: BadgeConfig["sizes"];
    variant: BadgeOwnProps["variant"];
  }>;
}

export type BadgeConfig = ComponentConfig<{
  componentName: "Badge";
  defaultTag: "span";
  ownProps: BadgeOwnProps;
  statics: EmptyStatics;
  defaultProps: { size: "md"; display: "inline-flex"; align: "center"; rounded: "full" };
  sizes: "xs" | "sm" | "md" | "lg";
  sets: string
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  defaultTag: "span",
  defaultProps: { size: "md", display: "inline-flex", align: "center", rounded: "full" },
  render: function BadgeRender({ variant, size, dotIcon, children, ref, ...rest }) {
    const resolvedSize = useResolvedSize(size);
    const layout = useLayoutContext();
    const resolvedVariant = variant ?? (layout.variant as BadgeOwnProps["variant"]) ?? "Filled";

    const ctx = useMemo(
      () => ({ size: resolvedSize, variant: resolvedVariant }),
      [resolvedSize, resolvedVariant],
    );
    return (
      <LayoutProvider value={ctx}>
        <Box
          as="span"
          ref={ref}
          mod={{ size: resolvedSize }}
          fontWeight={600}
          gap="xs"
          {...rest}
        >
          {dotIcon && dotIcon({ size: resolvedSize, variant: resolvedVariant })}
          {children}
        </Box>
      </LayoutProvider>
    );
  },
});
