import { LayoutProvider } from "../../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig } from "../../../factory";
import type { ComponentVariants, Scales } from "../../../theme";
import { Box } from "./Box";

export interface LayoutProps {}

export type LayoutConfig = ComponentConfig<{
  componentName: "Layout";
  defaultTag: "div";
  ownProps: LayoutProps;
  defaultProps: {};
  sizes: Scales;
  variants: ComponentVariants;
}>;

export const Layout = ComponentFactory<LayoutConfig>({
  componentName: "Layout",
  defaultTag: "div",
  render: ({ ref, layoutCtx, set, size, section, variant, orientation, ...rest }) => {
    return (
      <LayoutProvider value={layoutCtx}>
        <Box ref={ref} mod={{ orientation, size, variant, section, set }} {...rest} />
      </LayoutProvider>
    );
  },
});
