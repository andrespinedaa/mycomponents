import { useMemo } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
  type OrientationProp,
} from "../../factory";
import { LayoutProvider } from "../../context/LayoutContext";
import type { ScaleRange, SystemVariants } from "../../theme";
import { Box, Flex } from "../Primitives";

export const CardSection = ComponentFactory<
  ComponentConfig<{
    componentName: "CardSection";
    defaultTag: "div";
    ownProps: {};
    statics: EmptyStatics;
    defaultProps: { dataSlot: "Section" };
  }>
>({
  componentName: "CardSection",
  defaultTag: "div",
  defaultProps: { dataSlot: "Section" },
  render: ({ ref, ...rest }) => <Box ref={ref} {...rest} />,
});

export type CardConfig = ComponentConfig<{
  componentName: "Card";
  defaultTag: "div";
  ownProps: {
    orientation?: OrientationProp;
    variant?: SystemVariants<"Filled" | "Elevated" | "Default" | "Outlined">;
  };
  statics: {
    Section: typeof CardSection;
  };
  defaultProps: {
    orientation: "vertical";
    variant: "Default";
  };
  sizes: ScaleRange<"sm" | "md" | "lg" | "xl">;
}>;

export const Card = ComponentFactory<CardConfig>({
  componentName: "Card",
  defaultTag: "div",
  defaultProps: {
    orientation: "vertical",
    variant: "Default",
  },
  statics: { Section: CardSection },
  render: ({ orientation, children, ref, hooks, size = "md", ...rest }) => {
    const flexDir = orientation === "horizontal" ? "row" : "column";
    const ctx = useMemo(() => ({ orientation }), [orientation]);
    return (
      <LayoutProvider value={ctx}>
        <Flex ref={ref} mod={[{ orientation }]} flexDir={flexDir} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
