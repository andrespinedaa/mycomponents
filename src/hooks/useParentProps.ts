import { createContext, useContext } from "react";

export type ParentPropsContexType = Record<string, unknown>;

export const ParentPropsContext = createContext<ParentPropsContexType>({});

/**
 * @param keys - Props que el hijo quiere heredar del padre
 *
 * @example
 * // Divider leyendo orientation de Card
 * const { orientation } = useParentProps<CardProps>(["orientation"]);
 *
 * @example
 * // Múltiples props
 * const { size, disabled } = useParentProps<InputGroupProps>(["size", "disabled"]);
 */

export function useParentProps<T extends Record<string, unknown>>(
  keys: ReadonlyArray<keyof T>,
): Partial<T> {
  const ctx = useContext(ParentPropsContext);
  const result: Partial<T> = {};
  for (const key of keys) {
    const k = key as string;
    if (k in ctx) {
      (result as Record<string, unknown>)[k] = ctx[k];
    }
  }
  return result;
}
