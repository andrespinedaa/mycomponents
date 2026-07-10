import type { InputHTMLAttributes } from "react";
import { useLayoutContext } from "../../context/LayoutContext";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useTheme } from "../../hooks";
import { resolveValue } from "../../system/resolve-value";
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
  defaultProps: {};
  sizes: "sm" | "md" | "lg";
  presets: string;
  variants: "Default" | "Filled" | "Unstyled";
}>;

export const Input = ComponentFactory<InputConfig>({
  componentName: "Input",
  defaultTag: "div",
  render: function InputRender({
    label,
    hint,
    error,
    leftSection,
    rightSection,
    size,
    variant,
    id,
    children,
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
    ref,
    ...rest
  }) {
    const { theme } = useTheme();
    const layout = useLayoutContext();
    const resolvedSize = size ?? (layout.size as InputConfig["sizes"] | undefined) ?? "md";
    const resolvedVariant = variant ?? layout.variant ?? "Default";
    const sizeConfig = theme.components.Input?.sizes?.[resolvedSize] ?? {};
    const pxToken = (sizeConfig.px as string) ?? "sm";
    const pxValue = resolveValue(pxToken, "spacing", theme);

    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const hasError = Boolean(error);

    const wrapperStyle: React.CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: `var(--${theme.cssVarPrefix}-radius-md)`,
      border: `1px solid ${
        hasError
          ? `var(--${theme.cssVarPrefix}-color-danger-500)`
          : `var(--${theme.cssVarPrefix}-color-neutral-300)`
      }`,
      background: disabled
        ? `var(--${theme.cssVarPrefix}-color-neutral-100)`
        : `var(--${theme.cssVarPrefix}-color-neutral-50)`,
      transition: "border-color 0.15s, box-shadow 0.15s",
      opacity: disabled ? 0.6 : 1,
    };

    return (
      <Box ref={ref} mod={{ size: resolvedSize, variant: resolvedVariant }} {...rest}>
        {label && (
          <Text
            as="label"
            htmlFor={inputId}
            size="sm"
            weight={500}
            style={{ display: "block", marginBottom: "0.375rem" }}
          >
            {label}
            {required && (
              <span
                style={{
                  color: `var(--${theme.cssVarPrefix}-color-danger-500)`,
                  marginLeft: "2px",
                }}
              >
                *
              </span>
            )}
          </Text>
        )}
        <div
          style={wrapperStyle}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = hasError
              ? `var(--${theme.cssVarPrefix}-color-danger-500)`
              : `var(--${theme.cssVarPrefix}-color-primary-500)`;
            (e.currentTarget as HTMLElement).style.boxShadow = hasError
              ? `0 0 0 3px var(--${theme.cssVarPrefix}-color-danger-100)`
              : `0 0 0 3px var(--${theme.cssVarPrefix}-color-primary-100)`;
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = hasError
              ? `var(--${theme.cssVarPrefix}-color-danger-500)`
              : `var(--${theme.cssVarPrefix}-color-neutral-300)`;
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {leftSection && (
            <Flex
              apply="@flexCenter"
              style={{
                paddingLeft: pxValue,
                paddingRight: "0.25rem",
                flexShrink: 0,
              }}
            >
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
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "inherit",
              color: "inherit",
              paddingLeft: leftSection ? "0" : pxValue,
              paddingRight: rightSection ? "0" : pxValue,
              minWidth: 0,
            }}
          />
          {rightSection && (
            <Flex
              apply="@flexCenter"
              style={{
                paddingRight: pxValue,
                paddingLeft: "0.25rem",
                flexShrink: 0,
              }}
            >
              {rightSection}
            </Flex>
          )}
        </div>
        {error && (
          <Text
            id={`${inputId}-error`}
            size="xs"
            style={{
              marginTop: "0.25rem",
              color: `var(--${theme.cssVarPrefix}-color-danger-600)`,
            }}
          >
            {error}
          </Text>
        )}
        {!error && hint && (
          <Text
            id={`${inputId}-hint`}
            size="xs"
            style={{
              marginTop: "0.25rem",
              color: `var(--${theme.cssVarPrefix}-color-neutral-500)`,
            }}
          >
            {hint}
          </Text>
        )}
      </Box>
    );
  },
});
