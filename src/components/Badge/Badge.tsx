import { useMemo } from "react";
import { LayoutProvider } from "../../context/LayoutContext";
import {
  ComponentFactory,
  type ComponentConfig,
  type FactoryRender,
} from "../../factory";
import { useResolveLayout } from "../../hooks";
import { Box } from "../Primitives/Box";

export interface DotBadgeOwnProps {
  dotColor?: string;
}

export type DotBadgeConfig = ComponentConfig<{
  defaultProps: {};
  defaultTag: "span";
  componentName: "DotBadge";
  ownProps: DotBadgeOwnProps;
  sizes: "xs" | "sm" | "md" | "lg";
}>;

export const DotBadge = ComponentFactory<DotBadgeConfig>({
  defaultTag: "span",
  componentName: "DotBadge",
  render: function DotBadgeRender({ dotColor, ref, ...rest }) {
    return (
      <Box
        as="span"
        ref={ref}
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
  defaultProps: { size: "md"; display: "inline-flex"; align: "center"; rounded: "full" };
  sizes: "xs" | "sm" | "md" | "lg";
  variants: "Filled" | "Subtle" | "Outlined";
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  defaultTag: "span",
  defaultProps: {
    size: "md",
    display: "inline-flex",
    align: "center",
    rounded: "full",
  },
  render: function BadgeRender({
    ref,
    dotIcon,
    children,
    size: sizeProp,
    variant: variantProp,
    ...rest
  }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
    const ctx = useMemo(() => ({ size, variant }), [size, variant]);

    return (
      <LayoutProvider value={ctx}>
        <Box as="span" ref={ref} gap="xs" fontWeight={600} mod={{ size, variant }} {...rest}>
          {children}
        </Box>
      </LayoutProvider>
    );
  },
});
