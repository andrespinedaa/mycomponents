import type { InputHTMLAttributes } from "react";
import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box, Text } from "../Primitives";

type SafeInputHTMLAttributes = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export interface InputOwnProps {
  label?: string;
  hint?: string;
  error?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export type InputConfig = ComponentConfig<{
  componentName: "Input";
  defaultTag: "div";
  ownProps: InputOwnProps & SafeInputHTMLAttributes;
  defaultProps: {};
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled";
}>;

export const Input = ComponentFactory<InputConfig>({
  componentName: "Input",
  render: function InputRender({
    ref,
    id,
    set,
    type,
    name,
    hint,
    label,
    value,
    error,
    onBlur,
    onFocus,
    disabled,
    required,
    onChange,
    readOnly,
    placeholder,
    orientation,
    leftSection,
    rightSection,
    defaultValue,
    size,
    variant,
    "data-slot": _slot,
    ...rest
  }) {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const hasError = Boolean(error);

    return (
      <Box ref={ref} flexDir="column" {...rest}>
        {label && (
          <Text as="label" htmlFor={inputId} size="sm" weight={500} mb="xs">
            {label}
            {required && (
              <Text as="span" color="danger.500" ml="2px">
                *
              </Text>
            )}
          </Text>
        )}

        <Box
          mod={[{ variant, size, set, orientation, disabled: disabled, invalid: hasError }]}
        >
          {leftSection && (
            <Box apply="@flexCenter" flexShrink={1} px="xs">
              {leftSection}
            </Box>
          )}

          <Box
            as="input"
            id={inputId}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            name={name}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-invalid={hasError || undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            apply="@inputReset"
            flexGrow={1}
          />

          {rightSection && (
            <Box apply="@flexCenter" flexShrink={1} px="xs">
              {rightSection}
            </Box>
          )}
        </Box>

        {error && (
          <Text id={`${inputId}-error`} size="xs" color="danger.600" mt="xs">
            {error}
          </Text>
        )}
        {!error && hint && (
          <Text id={`${inputId}-hint`} size="xs" color="neutral.500" mt="xs">
            {hint}
          </Text>
        )}
      </Box>
    );
  },
});
