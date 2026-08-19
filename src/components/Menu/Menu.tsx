import { ComponentFactory, type ComponentConfig } from "../../factory";

export interface MenuProps {}

export type MenuConfig = ComponentConfig<{
  tag: "ul";
  name: "Menu";
  ownProps: MenuProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
}>;

export const Menu = ComponentFactory<MenuConfig>({ name: "Menu", render: "ul" });
