import { ComponentFactory, type ComponentConfig } from "../../factory";

export interface ButtonOwnProps {}

export type ButtonConfig = ComponentConfig<{
  tag: "button";
  name: "Button";
  ownProps: ButtonOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Elevated" | "Filled" | "Outlined" | "Ghost";
}>;

export const Button = ComponentFactory<ButtonConfig>({ name: "Button", render: "button" });
