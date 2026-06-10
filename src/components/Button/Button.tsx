import type { FactoryRenderProps } from "../../factory/factory.types";

export interface ButtonOwnProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

// _Button recibe exactamente FactoryRenderProps — mismo tipo que la factory
function _Button({
  ref,
  props,
  Component,
  elementProps,
  modProps,
  slotProps,
  getStyle,
}: FactoryRenderProps<"button", ButtonOwnProps>) {
  const { className, variant = "solid", size = "md" } = props;

  return (
    <Component
      ref={ref}
      className={className}
      style={getStyle()}
      data-variant={variant}
      data-size={size}
      {...slotProps}
      {...modProps}
      {...elementProps}
    />
  );
}

// Le pasas _Button directamente a la factory
export const Button = () => <button>hola</button>;

Button.displayName = "Button";
