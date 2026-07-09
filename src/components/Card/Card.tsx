import { useMemo } from "react";
import { ComponentFactory, type ComponentConfig, type EmptyStatics, type OrientationProp } from "../../factory";
import type { SystemVariants } from "../../theme";
import { LayoutProvider, useLayoutContext } from "../../context/LayoutContext";
import { Flex } from "../Primitives";

export type CardSectionSets = "default" | "background" | "top" | "gradient";

export interface CardSectionOwnProps {
  section?: "header" | "body" | "footer" | "media";
  preset?: CardSectionSets;
}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  statics: EmptyStatics;
  defaultProps: { section: "body"; preset: "default" };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  slots: "header" | "body" | "footer" | "media";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  componentName: "CardSection",
  defaultTag: "div",
  defaultProps: { section: "body", preset: "default" },
  render: function CardSectionRender({ section, preset, ref, ...rest }) {
    const { size } = useLayoutContext();
    return <Flex ref={ref} mod={{ section, preset, size }} {...rest} />;
  },
});

export interface CardOwnProps {
  orientation?: OrientationProp;
  variant?: SystemVariants<"Filled" | "Elevated" | "Default" | "Outlined">;
}

export type CardConfig = ComponentConfig<{
  componentName: "Card";
  defaultTag: "div";
  ownProps: CardOwnProps;
  statics: {
    Section: typeof CardSection;
  };
  defaultProps: {
    orientation: "vertical";
    variant: "Default";
    size: "md";
  };
  sizes: "sm" | "md" | "lg" | "xl";
  presets: "";
  slots: "";
}>;

export const Card = ComponentFactory<CardConfig>({
  defaultTag: "div",
  componentName: "Card",
  statics: { Section: CardSection },
  defaultProps: { orientation: "vertical", variant: "Default", size: "md", cursor: "pointer" },
  render: function CardRender({ orientation, variant, children, ref, size, ...rest }) {
    const ctx = useMemo(() => ({ orientation, size, variant }), [orientation, size, variant]);
    return (
      <LayoutProvider value={ctx}>
        <Flex ref={ref} mod={[{ orientation, size, variant }]} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
