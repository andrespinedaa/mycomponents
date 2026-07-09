import type { OrientationProp } from "../factory";
import { useCreateProvider } from "../hooks/useCreateProvider";
import type { Scales, ComponentVariants } from "../theme";

export interface LayoutContextValue {
  orientation?: OrientationProp;
  size?: Scales;
  variant?: ComponentVariants;
}

export const [LayoutProvider, useLayoutContext, LayoutContext] = useCreateProvider<LayoutContextValue>(
  "Layout",
  {} as LayoutContextValue,
);
