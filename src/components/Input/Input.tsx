import type { InputHTMLAttributes } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";
import { Text } from "../Primitives/Text/Text";

// Excluye "size" de HTML attrs porque colisiona con nuestro prop string
type SafeInputHTMLAttributes = Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

export interface InputOwnProps {
  label?: string;
  hint?: string;
  error?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "Default" | "Filled" | "Unstyled";
}

export type InputConfig = ComponentConfig<{
  componentName: "Input";
  defaultTag: "div";
  ownProps: InputOwnProps & SafeInputHTMLAttributes;
  statics: EmptyStatics;
  defaultProps: { size: "md"; variant: "Default" };
}>;

const SIZE_STYLES = {
  sm: { height: "2rem",   fontSize: "0.875rem", px: "0.625rem" },
  md: { height: "2.5rem", fontSize: "0.9375rem", px: "0.75rem" },
  lg: { height: "3rem",   fontSize: "1rem",      px: "1rem" },
};

export const Input = ComponentFactory<InputConfig>({
  componentName: "Input",
  defaultTag: "div",
  defaultProps: { size: "md", variant: "Default" },
  render: ({
    label,
    hint,
    error,
    leftSection,
    rightSection,
    size = "md",
    variant: _variant,
    id,
    children: _children,
    // extract all HTML input attrs
    type,
    value,
    defaultValue,
    placeholder,
    disabled,
    required,
    readOnly,
    name,
    onChange,
    onFocus,
    onBlur,
    ...rest
  }) => {
    const sz = SIZE_STYLES[size];
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const hasError = Boolean(error);

    const wrapperStyle: React.CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: sz.height,
      borderRadius: "var(--mycomponents-radius-md)",
      border: `1px solid ${hasError ? "var(--mycomponents-color-danger-500)" : "var(--mycomponents-color-neutral-300)"}`,
      background: disabled ? "var(--mycomponents-color-neutral-100)" : "var(--mycomponents-color-neutral-50)",
      transition: "border-color 0.15s, box-shadow 0.15s",
      opacity: disabled ? 0.6 : 1,
    };

    const inputStyle: React.CSSProperties = {
      flex: 1,
      height: "100%",
      border: "none",
      background: "transparent",
      outline: "none",
      fontSize: sz.fontSize,
      color: "inherit",
      padding: `0 ${leftSection ? "0.25rem" : sz.px}`,
      paddingLeft: leftSection ? "0" : sz.px,
      paddingRight: rightSection ? "0" : sz.px,
      minWidth: 0,
    };

    return (
      <Box {...(rest as any)}>
        {label && (
          <Text
            as="label"
            htmlFor={inputId}
            size="sm"
            weight={500}
            style={{ display: "block", marginBottom: "0.375rem" }}
          >
            {label}
            {required && <span style={{ color: "var(--mycomponents-color-danger-500)", marginLeft: "2px" }}>*</span>}
          </Text>
        )}
        <div
          style={wrapperStyle}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = hasError
              ? "var(--mycomponents-color-danger-500)"
              : "var(--mycomponents-color-primary-500)";
            (e.currentTarget as HTMLElement).style.boxShadow = hasError
              ? "0 0 0 3px var(--mycomponents-color-danger-100)"
              : "0 0 0 3px var(--mycomponents-color-primary-100)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = hasError
              ? "var(--mycomponents-color-danger-500)"
              : "var(--mycomponents-color-neutral-300)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {leftSection && (
            <Flex apply="@flexCenter" style={{ paddingLeft: sz.px, paddingRight: "0.25rem", flexShrink: 0, color: "var(--mycomponents-color-neutral-400)" }}>
              {leftSection}
            </Flex>
          )}
          <input
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
            style={inputStyle}
          />
          {rightSection && (
            <Flex apply="@flexCenter" style={{ paddingRight: sz.px, paddingLeft: "0.25rem", flexShrink: 0, color: "var(--mycomponents-color-neutral-400)" }}>
              {rightSection}
            </Flex>
          )}
        </div>
        {error && (
          <Text id={`${inputId}-error`} size="xs" style={{ marginTop: "0.25rem", color: "var(--mycomponents-color-danger-600)" }}>
            {error}
          </Text>
        )}
        {!error && hint && (
          <Text id={`${inputId}-hint`} size="xs" style={{ marginTop: "0.25rem", color: "var(--mycomponents-color-neutral-500)" }}>
            {hint}
          </Text>
        )}
      </Box>
    );
  },
});
