import type { OrientationProp } from "../factory";
import { useCreateProvider } from "../hooks/useCreateProvider";

export interface LayoutContextValue {
  orientation?: OrientationProp;
}

export const [LayoutProvider, useLayoutContext] =
  useCreateProvider<LayoutContextValue>("Layout", {} as LayoutContextValue);
