import { ComponentFactory, type ComponentConfig } from "../../factory";
import type { Item } from "./Item";

export interface MenuProps {}

export type MenuConfig = ComponentConfig<{
  tag: "ul";
  name: "Menu";
  ownProps: MenuProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
  statics: {
    Item: typeof Item;
  };
}>;

export const Menu = ComponentFactory<MenuConfig>({ name: "Menu", render: "ul" });
