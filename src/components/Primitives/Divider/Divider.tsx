import { ComponentFactory, type ComponentConfig, type OrientationProp } from "../../../factory";
import type { CSSLength, ColorValue } from "../../../theme";
import { Box } from "..";

export interface DividerOwnProps {
  orientation?: OrientationProp;
  thickness?: CSSLength;
  color?: ColorValue;
  label?: string;
}

export type DividerConfig = ComponentConfig<{
  componentName: "Divider";
  defaultTag: "div";
  ownProps: DividerOwnProps;
  defaultProps: {
    orientation: "horizontal";
    thickness: "1px";
  };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: "label";
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultProps: { orientation: "horizontal", thickness: "1px" },
  render: function DividerRender({
    set,
    ref,
    size,
    label,
    variant,
    children,
    position,
    thickness,
    orientation,
    ...rest
  }) {

    <Box
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      h={children ? undefined : thickness}
      mod={[{ orientation, size, variant, set }]}
      {...rest}
    >
      {children &&
        <>
          <Box
            h={thickness}
            role="separator"
            aria-orientation={orientation}
            mod={[{ orientation, size, variant, set }]}
          />
          {children}
          <Box
            h={thickness}
            role="separator"
            aria-orientation={orientation}
            mod={[{ orientation, size, variant, set }]}

          />
        </>}
    </Box>
  },
});
