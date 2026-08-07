import { ComponentFactory, type ComponentConfig } from "../../../factory";
import { Box } from "../Box";

export interface DividerOwnProps {}

export type DividerConfig = ComponentConfig<{
  tag: "div";
  name: "Divider";
  presets: "label";
  ownProps: DividerOwnProps;
  variants: "Filled" | "Elevated";
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export const Divider = ComponentFactory<DividerConfig>({
  name: "Divider",
  render: ({ ref, children, variant = "Filled", orientation = "horizontal", set, ...rest }) => {
    return (
      <Box
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        orientation={orientation}
        variant={variant}
        {...rest}
      >
        {children && (
          <>
            <Box aria-hidden orientation={orientation} variant={variant} />
            {children}
            <Box aria-hidden orientation={orientation} variant={variant} />
          </>
        )}
      </Box>
    );
  },
});
