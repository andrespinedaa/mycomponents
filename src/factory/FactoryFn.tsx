import type { ElementType } from "react";
import React from "react";
import type {
    FactoryComponentPrimitive,
    FactoryComponentProps,
    SystemProps,
} from "./factory.types";

// FactoryFn.tsx
export function FactoryFn<
  DefaultTag extends ElementType,
  OwnProps = object,
  Statics extends Record<string, unknown> = Record<string, never>,
>(
  defaultTag: DefaultTag,
  render: (_props: OwnProps & SystemProps) => React.ReactElement | null,
  statics?: Statics,
) {
  const ForwardedFactory = React.forwardRef<
    any,
    FactoryComponentProps<DefaultTag, OwnProps>
  >(function FactoryComponent(_props, ref) {
    // useProps aplicaría defaults aquí
    return render({ ..._props, ref } as any);
  });

  if (statics) Object.assign(ForwardedFactory, statics);
  return ForwardedFactory as unknown as FactoryComponentPrimitive<
    DefaultTag,
    OwnProps,
    Statics
  >;
}
