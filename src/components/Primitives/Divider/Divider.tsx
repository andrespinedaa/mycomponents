import {
  ComponentFactory,
  type ComponentConfig,
  type OrientationProp,
} from "../../../factory";
import type { CSSLength, ColorValue, Scales } from "../../../theme";
import { useLayoutContext } from "../../../context/LayoutContext";
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
  sizes: Scales;
  presets: "label";
}>;

export const Divider = ComponentFactory<DividerConfig>({
  defaultTag: "div",
  componentName: "Divider",
  defaultProps: { orientation: "horizontal", position: "center", thickness: "1px", size: "md" },
  render: function DividerRender({
    set: _set,
    ref,
    color,
    label,
    position,
    thickness,
    size: sizeProp,
    variant: variantProp,
    orientation: orientationProp,
    ...rest
  }) {
    const layout = useLayoutContext();
    const size = layout.size ?? sizeProp;
    const variant = layout.variant ?? variantProp;
    const orientation = layout.orientation ?? orientationProp;
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
