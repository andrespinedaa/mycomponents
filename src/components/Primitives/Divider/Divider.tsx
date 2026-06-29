import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import { useLayoutContext } from "../../../context/LayoutContext";
import type { ColorValue } from "../../../theme/generators/system-css.data";
import type { CSSLength } from "../../../theme/theme.types";
import { Box } from "../Box/Box";
import { Flex } from "../Flex/Flex";
import { Text } from "../Text/Text";

export interface DividerOwnProps {
  orientation?: "horizontal" | "vertical";
  /** Posición del label sobre la línea. Por defecto "center". */
  position?: "start" | "center" | "end";
  thickness?: CSSLength;
  color?: ColorValue;
  label?: string;
}

type DividerHooks = {
  layout: ReturnType<typeof useLayoutContext>;
};

export type DividerConfig = ComponentConfig<{
  componentName: "Divider";
  defaultTag: "div";
  ownProps: DividerOwnProps;
  statics: EmptyStatics;
  defaultProps: { orientation: "horizontal" };
  hooks: DividerHooks;
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultTag: "div",
  defaultProps: { orientation: "horizontal" },
  useHooks: () => ({ layout: useLayoutContext() }),
  render: ({
    orientation,
    position = "center",
    thickness = "1px",
    color,
    label,
    ref,
    hooks,
    ...rest
  }) => {
    const { layout } = hooks;
    const resolvedOrientation = orientation ?? layout.orientation ?? "horizontal";
    const isVertical = resolvedOrientation === "vertical";
    const lineMacro = isVertical ? "@dividerLineV" : "@dividerLineH";
    const thicknessVar = { "--divider-thickness": thickness };

    if (label) {
      return (
        <Flex
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
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
        aria-orientation={resolvedOrientation as "horizontal" | "vertical"}
        apply={lineMacro}
        borderColor={color}
        vars={thicknessVar}
        {...rest}
      />
    );
  },
});
