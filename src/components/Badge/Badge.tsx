import { useMemo } from "react";
import { LayoutProvider } from "../../context/LayoutContext";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
  type FactoryRender,
} from "../../factory";
import { useResolveLayout } from "../../hooks";
import type { ScaleRange, SystemVariants } from "../../theme";
import { Box } from "../Primitives/Box";

export interface DotBadgeOwnProps {
  dotColor?: string;
}

export type DotBadgeConfig = ComponentConfig<{
  presets: string;
  defaultProps: {};
  defaultTag: "span";
  variants: "Default";
  statics: EmptyStatics;
  componentName: "DotBadge";
  ownProps: DotBadgeOwnProps;
  sizes: "xs" | "sm" | "md" | "lg";
}>;

export const DotBadge = ComponentFactory<DotBadgeConfig>({
  componentName: "DotBadge",
  defaultTag: "span",
  defaultProps: {},
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
  statics: EmptyStatics;
  defaultProps: { size: "md"; display: "inline-flex"; align: "center"; rounded: "full" };
  sizes: ScaleRange<"xs" | "sm" | "md" | "lg">;
  presets: string;
  variants: SystemVariants<"Default">;
}>;

export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",
  defaultTag: "span",
  defaultProps: {
    size: "md",
    display: "inline-flex",
    align: "center",
    rounded: "full",
    variant: "Default",
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
