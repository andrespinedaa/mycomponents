import type { OrientationProp } from "../factory";
import { useCreateProvider } from "../hooks/useCreateProvider";
import type { Scales } from "../theme";
import type { ComponentVariants } from "../theme/core/theme.variants";

export interface LayoutContextValue {
  orientation?: OrientationProp;
  size?: Scales;
  variant?: ComponentVariants;
}

export const [LayoutProvider, useLayoutContext] =
  useCreateProvider<LayoutContextValue>("Layout", {} as LayoutContextValue);
