import { ComponentFactory, type ComponentConfig } from "../../factory";

export interface ItemProps {}

export type ItemConfig = ComponentConfig<{
  tag: "li";
  name: "Item";
  ownProps: ItemProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
}>;

export const Item = ComponentFactory<ItemConfig>({ name: "Item", render: "li" });
