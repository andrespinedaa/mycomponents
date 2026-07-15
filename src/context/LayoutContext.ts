import type { OrientationProp } from "../factory";
import { useCreateProvider } from "../hooks/useCreateProvider";
import type { Scales, ComponentVariants } from "../theme";

export interface LayoutContextValue {
  orientation?: OrientationProp;
  size?: Scales;
  variant?: ComponentVariants;
  set?: string;
  // Nombre canónico del componente que proveyó este layer de contexto (ej. "Card"). Lo usa
  // useResolveLayout para el gate de compound component: `set` solo se hereda si quien provee
  // el contexto es el padre declarado (`parentName`) de quien lo consume — nunca por casualidad
  // de anidamiento (ver useResolveLayout.ts).
  componentName?: string;
}

export const [LayoutProvider, useLayoutContext, LayoutContext] = useCreateProvider<LayoutContextValue>(
  "Layout",
  {} as LayoutContextValue,
);
