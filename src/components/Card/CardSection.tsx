import { LayoutProvider } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box } from "../Primitives";

export type CardSectionSets = "cover" | "alignTop" | "gradient";
export type CardSectionMediaSets = "alignTop" | "alignBottom" | "cover";
export type CardSectionHeaderSets = "top" | "bottom";
export type CardSectionFooterSets = "static" | "undergorund";
export type CardSectionBodySets = "compact";
export type CardSections = "header" | "body" | "footer" | "media";

export interface CardSectionOwnProps {}

export type CardSectionConfig = ComponentConfig<{
  componentName: "CardSection";
  defaultTag: "div";
  ownProps: CardSectionOwnProps;
  sections: {
    media: CardSectionMediaSets;
    header: CardSectionHeaderSets;
    footer: CardSectionFooterSets;
    body: CardSectionBodySets;
  };
  defaultProps: { section: "body" };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: CardSectionSets;
  variants: "Filled" | "Elevated" | "Outlined";
}>;

export const CardSection = ComponentFactory<CardSectionConfig>({
  componentName: "CardSection",
  defaultProps: { section: "body" },
  render: function CardSectionRender({ ref, layoutCtx, set, size, section, variant, ...rest }) {
    return (
      <LayoutProvider value={layoutCtx}>
        <Box ref={ref} mod={{ size, variant, section, set }} {...rest} />
      </LayoutProvider>
    );
  },
});
