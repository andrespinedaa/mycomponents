import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import type { Variant } from "../../theme/theme.variants";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";

export const CardHeader = ComponentFactory<
  ComponentConfig<{
    componentName: "CardHeader";
    defaultTag: "div";
    ownProps: {};
    statics: EmptyStatics;
    defaultProps: { dataSlot: "Header" };
  }>
>({
  componentName: "CardHeader",
  defaultTag: "div",
  defaultProps: { dataSlot: "Header" },
  render: (resolvedProps) => <Box {...resolvedProps} />,
});

export const CardBody = ComponentFactory<
  ComponentConfig<{
    componentName: "CardBody";
    defaultTag: "div";
    ownProps: {};
    statics: EmptyStatics;
    defaultProps: { dataSlot: "Body" };
  }>
>({
  componentName: "CardBody",
  defaultTag: "div",
  defaultProps: { dataSlot: "Body" },
  render: (resolvedProps) => <Box {...resolvedProps} />,
});

export const CardFooter = ComponentFactory<
  ComponentConfig<{
    componentName: "CardFooter";
    defaultTag: "div";
    ownProps: {};
    statics: EmptyStatics;
    defaultProps: { dataSlot: "Footer" };
  }>
>({
  componentName: "CardFooter",
  defaultTag: "div",
  defaultProps: { dataSlot: "Footer" },
  render: (resolvedProps) => <Box {...resolvedProps} />,
});

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
  render: (resolvedProps) => <Box {...resolvedProps} />,
});

export const CardImage = ComponentFactory<
  ComponentConfig<{
    componentName: "CardImage";
    defaultTag: "div";
    ownProps: {};
    statics: EmptyStatics;
    defaultProps: { dataSlot: "Image" };
  }>
>({
  componentName: "CardImage",
  defaultTag: "div",
  defaultProps: { dataSlot: "Image" },
  render: (resolvedProps) => <Box as="figure" {...resolvedProps} />,
});

export interface CardProps {
  orientation?: "row" | "column";
  variant?: Variant<"Filled" | "Elevated" | "Default" | "Outlined">;
}

export type CardConfig = ComponentConfig<{
  componentName: "Card";
  defaultTag: "div";
  ownProps: CardProps;
  statics: {
    Header: typeof CardHeader;
    Body: typeof CardBody;
    Footer: typeof CardFooter;
    Section: typeof CardSection;
    Image: typeof CardImage;
  };
  defaultProps: {
    orientation: "column";
    variant: "Default";
  };
}>;

export const Card = ComponentFactory<CardConfig>({
  componentName: "Card",
  defaultTag: "div",
  defaultProps: {
    orientation: "column",
    variant: "Default",
  },
  statics: {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
    Section: CardSection,
    Image: CardImage,
  },
  render: (resolvedProps) => {
    const { orientation, children, ...rest } = resolvedProps;
    return (
      <Flex mod={[{ orientation }]} flexDir={orientation} {...rest}>
        {children}
      </Flex>
    );
  },
});
