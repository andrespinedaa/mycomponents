import type { OrientationProp } from "../factory";
import { useCreateContext } from "../hooks/useCreateContext";
import type { Scales, ComponentVariants } from "../theme";

export interface LayoutContextValue {
  set?: string;
  size?: Scales;
  name?: string;
  variant?: ComponentVariants;
  orientation?: OrientationProp;
}

export const [LayoutProvider, useLayoutContext, LayoutContext] = useCreateContext<LayoutContextValue>(
  "Layout",
  {} as LayoutContextValue,
);
