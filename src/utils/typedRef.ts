import React from "react";

export function typedRef<T, P>(
  render: (props: P, ref: React.ForwardedRef<T>) => React.ReactNode,
) {
  return React.forwardRef(render as any) as React.ForwardRefExoticComponent<
    P & React.RefAttributes<T>
  >;
}
