// utils/typed-forward-ref.ts
import React from "react";

export function typedForwardRef<T, P>(
  render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null,
) {
  return React.forwardRef(render as any) as React.ForwardRefExoticComponent<
    P & React.RefAttributes<T>
  >;
}
