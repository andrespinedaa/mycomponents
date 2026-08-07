import React from "react";

export function useCreateContext<T>(name: string, defaultValue?: T) {
  const Context = React.createContext<T | null>(defaultValue ?? null);

  function useProvider() {
    const context = React.useContext(Context);

    if (!context) {
      throw new Error(
        `${name} context not found — wrap your component with the corresponding Provider`,
      );
    }

    return context;
  }

  Context.displayName = name;

  return [Context.Provider, useProvider, Context] as const;
}
