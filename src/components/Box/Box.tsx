import { PolymorphicFactoryFn } from "../../factory/PolymorphicFactory";

// Box no tiene OwnProps — solo SystemProps que ya vienen de la factory
export interface BoxProps {}

export const Box = PolymorphicFactoryFn<"div">("div");

Box.displayName = "Box";
