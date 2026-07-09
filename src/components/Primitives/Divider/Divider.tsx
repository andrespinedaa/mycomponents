import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../../factory";
import type { CSSLength, ColorValue, Scales } from "../../../theme";
import { useLayoutContext } from "../../../context/LayoutContext";
import { Box, Flex, Text } from "..";

export interface DividerOwnProps {
  orientation?: "horizontal" | "vertical";
  position?: "start" | "center" | "end";
  thickness?: CSSLength;
  color?: ColorValue;
  label?: string;
}

export type DividerConfig = ComponentConfig<{
  componentName: "Divider";
  defaultTag: "div";
  ownProps: DividerOwnProps;
  statics: EmptyStatics;
  defaultProps: {
    orientation: "horizontal";
    position: "center";
    thickness: "1px";
    size: "md";
  };
  sizes: Scales;
  sets: string;
}>;

export const Divider = ComponentFactory<DividerConfig>({
  defaultTag: "div",
  componentName: "Divider",
  defaultProps: { orientation: "horizontal", position: "center", thickness: "1px", size: "md" },
  render: function DividerRender({
    ref,
    color,
    label,
    position,
    thickness,
    size: sizeProp,
    orientation: orientationProp,
    ...rest
  }) {
    const layout = useLayoutContext();
    const orientation = layout.orientation ?? orientationProp;
    const size = layout.size ?? sizeProp;
    const thicknessVar = { "--divider-thickness": thickness };

    if (label) {
      return (
        <Flex
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          mod={[{ orientation, size }]}
          align="center"
          gap="sm"
          vars={thicknessVar}
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
        mod={[{ orientation, size }]}
        aria-orientation={orientation}
        borderColor={color}
        vars={thicknessVar}
        {...rest}
      />
    );
  },
});
