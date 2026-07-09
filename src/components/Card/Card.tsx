import { useMemo } from "react";
import { ComponentFactory, type ComponentConfig, type EmptyStatics, type OrientationProp } from "../../factory";
import type { SystemVariants } from "../../theme";
import { LayoutProvider } from "../../context/LayoutContext";
import { Flex } from "../Primitives";

export type CardSectionSets = "default" | "background" | "top" | "gradient";

export interface CardSectionOwnProps {
  section?: "header" | "body" | "footer" | "media";
  set?: CardSectionSets;
}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  statics: EmptyStatics;
  defaultProps: { section: "body"; set: "default" };
  sizes: "sm" | "md" | "lg" | "xl";
  sets: CardSectionSets;
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  componentName: "CardSection",
  defaultTag: "div",
  defaultProps: { section: "body", set: "default" },
  render: function CardSectionRender({ section, set, ref, ...rest }) {
    return <Flex ref={ref} mod={{ section, set }} {...rest} />;
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
  sets: "";
}>;

export const Card = ComponentFactory<CardConfig>({
  componentName: "Card",
  defaultTag: "div",
  defaultProps: {
    orientation: "vertical",
    variant: "Default",
    size: "md",
    cursor: "pointer",
  },
  statics: { Section: CardSection },
  render: function CardRender({ orientation, variant, children, ref, size, ...rest }) {
    const ctx = useMemo(() => ({ orientation, size, variant }), [orientation, size, variant]);
    return (
      <LayoutProvider value={ctx}>
        <Flex ref={ref} mod={[{ orientation }]} {...rest}>
          {children}
        </Flex>
      </LayoutProvider>
    );
  },
});
