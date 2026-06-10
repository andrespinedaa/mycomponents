import { createContext, useContext } from "react";

export function useCreateProvider<T>(name: string, defaultValue?: T) {
  // Si hay defaultValue lo usamos, si no null para forzar el error
  const Context = createContext<T | null>(defaultValue ?? null);

  function useProvider() {
    const context = useContext(Context);

    if (!context) {
      throw new Error(
        `${name} context not found — wrap your component with the corresponding Provider`
      );
    }

    return context;
  }

  return [Context.Provider, useProvider] as const;
}