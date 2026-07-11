import { useLayoutContext, type LayoutContextValue } from "../context/LayoutContext";
import type { OrientationProp } from "../factory";

export type ResolvedLayout = {
  orientation: OrientationProp;
  flexOrientation: "row" | "column";
  size: LayoutContextValue["size"];
  variant: LayoutContextValue["variant"];
};

export function useResolveLayout(own: LayoutContextValue): ResolvedLayout {
  const layout = useLayoutContext();
  const orientation = own.orientation ?? layout.orientation ?? "vertical";

  return {
    orientation,
    flexOrientation: orientation === "horizontal" ? "row" : "column",
    size: own.size ?? layout.size,
    variant: own.variant ?? layout.variant,
  };
}
