import {
  ComponentFactory,
  type ComponentConfig,
  type OrientationProp,
} from "../../../factory";
import type { CSSLength, ColorValue } from "../../../theme";
import { Box, Flex, Text } from "..";

export interface DividerOwnProps {
  orientation?: OrientationProp;
  position?: "start" | "center" | "end";
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
    position: "center";
    thickness: "1px";
    size: "md";
  };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: "label";
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultProps: { orientation: "horizontal", position: "center", thickness: "1px", size: "md" },
  render: function DividerRender({
    set: _set,
    ref,
    color,
    label,
    position,
    thickness,
    size,
    variant,
    orientation,
    ...rest
  }) {
    const thicknessVar = { "--divider-thickness": thickness };

    if (label) {
      return (
        <Flex
          gap="sm"
          ref={ref}
          align="center"
          role="separator"
          vars={thicknessVar}
          aria-orientation={orientation}
          mod={[{ orientation, size, variant }]}
          {...rest}
        >
          {position !== "start" && <Box flex={1} borderColor={color} />}
          <Text as="span" whiteSpace="nowrap">
            {label}
          </Text>
          {position !== "end" && <Box flex={1} borderColor={color} />}
        </Flex>
      );
    }

    return (
      <Box
        ref={ref}
        role="separator"
        vars={thicknessVar}
        borderColor={color}
        aria-orientation={orientation}
        mod={[{ orientation, size, variant }]}
        {...rest}
      />
    );
  },
});
