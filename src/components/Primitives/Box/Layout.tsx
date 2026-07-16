import { useMemo } from "react";
import { LayoutProvider } from "../../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";
import { Box } from "./Box";

export interface LayoutProps { }

export type LayoutConfig = ComponentConfig<{
  sizes: Scales;
  defaultProps: {};
  defaultTag: "div";
  ownProps: LayoutProps;
  componentName: "Layout";
  variants: ComponentVariants;
  slots: Record<string, string>;
}>;

export const Layout = ComponentFactory<LayoutConfig>({
  componentName: "Layout",
  render: function LayoutRender({ ref, set, size, section, variant, orientation, ...rest }) {
    const layoutCtx = useMemo(() => ({ size, variant, set, orientation }),
      [size, variant, set, orientation],
    );

    return (
      <LayoutProvider value={layoutCtx}>
        <Box ref={ref} mod={{ orientation, size, variant, section, set }} {...rest} />
      </LayoutProvider>
    );
  },
});
