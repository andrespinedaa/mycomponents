import { useMemo } from "react";
import { LayoutProvider, type LayoutContextValue } from "../../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";
import { Box } from "./Box";

export interface LayoutProps {}

export type LayoutConfig = ComponentConfig<{
  tag: "div";
  sizes: Scales;
  name: "Layout";
  presets: string;
  ownProps: LayoutProps;
  variants: ComponentVariants;
  slots: Record<string, string>;
}>;

export const Layout = ComponentFactory<LayoutConfig>({
  name: "Layout",
  render: function LayoutRender({ ref, set, size, slots, variant, orientation, ...rest }) {
    const layoutCtx = useMemo<LayoutContextValue>(
      () => ({ variant, set, orientation, name: rest.dataSlot }),
      [variant, set, orientation, rest.dataSlot],
    );

    return (
      <LayoutProvider value={layoutCtx}>
        <Box
          ref={ref}
          size={size}
          variant={variant}
          orientation={orientation}
          mod={{ slots, set }}
          {...rest}
        />
      </LayoutProvider>
    );
  },
});
