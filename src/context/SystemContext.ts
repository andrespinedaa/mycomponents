import { useCreateContext } from "../hooks/useCreateContext";
import type { Scales, VarsCss } from "../theme/theme.types";

export interface SystemContextValue {
  tokenVars: VarsCss;
  sizeResponsive: Scales;
  smallestBreakpoint: string;
}

export const [SystemContextProvider, useSystemContext, SystemContext] =
  useCreateContext<SystemContextValue>("SystemContext");
