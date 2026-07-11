import type { InputHTMLAttributes } from "react";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { Box, Flex, Text } from "../Primitives";

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
  statics: EmptyStatics;
  defaultProps: { size: "md"; variant: "Default" };
  sizes: "sm" | "md" | "lg";
  presets: string;
  variants: "Default" | "Filled" | "Unstyled";
}>;

export const Input = ComponentFactory<InputConfig>({
  componentName: "Input",
  defaultTag: "div",
  defaultProps: { size: "md", variant: "Default" },
  render: function InputRender({
    ref,
    id,
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
    leftSection,
    rightSection,
    defaultValue,
    size,
    variant,
    "data-slot": _slot,
    "data-mod": _mod,
    ...rest
  }) {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const hasError = Boolean(error);

    return (
      <Box ref={ref} display="flex" flexDir="column" {...rest}>
        {label && (
          <Text
            as="label"
            htmlFor={inputId}
            size="sm"
            weight={500}
            mb="xs"
          >
            {label}
            {required && (
              <Text as="span" color="danger.500" ml="2px">
                *
              </Text>
            )}
          </Text>
        )}

        <Box
          data-slot="Input"
          data-variant={variant}
          data-size={size}
          data-disabled={disabled || undefined}
          data-invalid={hasError || undefined}
          display="flex"
          align="center"
          position="relative"
        >
          {leftSection && (
            <Flex apply="@flexCenter" flexShrink={1} px="xs">
              {leftSection}
            </Flex>
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
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            apply="@inputReset"
            flexGrow={1}
          />

          {rightSection && (
            <Flex apply="@flexCenter" flexShrink={1} px="xs">
              {rightSection}
            </Flex>
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
