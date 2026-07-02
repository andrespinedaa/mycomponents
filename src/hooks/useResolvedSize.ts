import { useLayoutContext } from "../context/LayoutContext";
import type { Scales } from "../theme";

// Resuelve el size efectivo para compound components:
//   LayoutContext (compound parent) → size propio (defaultProps garantiza que no es undefined)
// El contexto gana sobre el default del hijo — permite que el padre uniforme el size de todos sus hijos.
export function useResolvedSize<S extends Scales>(size: S): S {
  const layout = useLayoutContext();
  return (layout.size as S | undefined) ?? size;
}
