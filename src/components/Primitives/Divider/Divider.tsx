import { ComponentFactory, type ComponentConfig } from "../../../factory";
import { Box } from "..";

export interface DividerOwnProps {}

export type DividerConfig = ComponentConfig<{
  componentName: "Divider";
  defaultTag: "div";
  ownProps: DividerOwnProps;
  defaultProps: {
    orientation: "horizontal";
  };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: "label";
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultProps: { orientation: "horizontal" },
  render: function DividerRender({
    set,
    ref,
    size,
    variant,
    children,
    orientation,
    ...rest
  }) {
    return (
      <Box
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        mod={[{ orientation, size, variant, set }]}
        {...rest}
      >
        {children && (
          <>
            <Box
              role="separator"
              aria-orientation={orientation}
              mod={[{ orientation, size, variant, set }]}
            />
            {children}
            <Box
              role="separator"
              aria-orientation={orientation}
              mod={[{ orientation, size, variant, set }]}
            />
          </>
        )}
      </Box>
    );
  },
});
