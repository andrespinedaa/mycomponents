import type { OrientationProp } from "../factory";
import { useCreateProvider } from "../hooks/useCreateProvider";
import type { Scales, ComponentVariants } from "../theme";

export interface LayoutContextValue {
  set?: string;
  size?: Scales;
  componentName?: string;
  variant?: ComponentVariants;
  orientation?: OrientationProp;
}

export const [LayoutProvider, useLayoutContext, LayoutContext] = useCreateProvider<LayoutContextValue>(
  "Layout",
  {} as LayoutContextValue,
);
