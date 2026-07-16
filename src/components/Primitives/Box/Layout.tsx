import { useMemo } from "react";
import { LayoutProvider, type LayoutContextValue } from "../../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";
import { Box } from "./Box";

export interface LayoutProps {}

export type LayoutConfig = ComponentConfig<{
  sizes: Scales;
  defaultProps: {};
  defaultTag: "div";
  ownProps: LayoutProps;
  componentName: "Layout";
  variants: ComponentVariants;
  slots: Record<string, string>;
  presets: string;
}>;

export const Layout = ComponentFactory<LayoutConfig>({
  componentName: "Layout",
  render: function LayoutRender({ ref, set, size, slots, variant, orientation, ...rest }) {
    const layoutCtx = useMemo<LayoutContextValue>(
      () => ({ size, variant, set, orientation, componentName: rest.dataSlot }),
      [size, variant, set, orientation, rest.dataSlot],
    );

    return (
      <LayoutProvider value={layoutCtx}>
        <Box ref={ref} mod={{ orientation, size, variant, slots, set }} {...rest} />
      </LayoutProvider>
    );
  },
});
