import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
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
  };
  sizes: Scales;
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultTag: "div",
  defaultProps: {
    orientation: "horizontal",
    position: "center",
    thickness: "1px",
  },
  render: function DividerRender({
    orientation,
    position,
    thickness,
    color,
    label,
    ref,
    ...rest
  }) {
    const layout = useLayoutContext();
    const resolvedOrientation =
      orientation ?? layout.orientation ?? "horizontal";
    const isVertical = resolvedOrientation === "vertical";
    const lineMacro = isVertical ? "@dividerLineV" : "@dividerLineH";
    const thicknessVar = { "--divider-thickness": thickness };

    if (label) {
      return (
        <Flex
          ref={ref}
          role="separator"
          aria-orientation={resolvedOrientation}
          align="center"
          gap="sm"
          vars={thicknessVar}
          {...rest}
        >
          {position !== "start" && (
            <Box flex={1} apply={lineMacro} borderColor={color} />
          )}
          <Text as="span" whiteSpace="nowrap">
            {label}
          </Text>
          {position !== "end" && (
            <Box flex={1} apply={lineMacro} borderColor={color} />
          )}
        </Flex>
      );
    }

    return (
      <Box
        ref={ref}
        role="separator"
        aria-orientation={resolvedOrientation}
        apply={lineMacro}
        borderColor={color}
        vars={thicknessVar}
        {...rest}
      />
    );
  },
});
