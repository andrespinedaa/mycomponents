import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box, Flex, Text } from "../Primitives";

export type AlertSeverity = "info" | "success" | "warning" | "danger";

export interface AlertOwnProps {
  severity?: AlertSeverity;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export type AlertConfig = ComponentConfig<{
  componentName: "Alert";
  defaultTag: "div";
  ownProps: AlertOwnProps;
  defaultProps: {
    severity: "info";
    variant: "Filled";
    size: "md";
    gap: "sm";
    rounded: "md";
    border: "1px solid";
  };
  sizes: "sm" | "md" | "lg";
  variants: "Subtle" | "Filled" | "Outlined";
}>;

export const Alert = ComponentFactory<AlertConfig>({
  componentName: "Alert",
  defaultTag: "div",
  defaultProps: {
    severity: "info",
    variant: "Filled",
    size: "md",
    gap: "sm",
    rounded: "md",
    border: "1px solid",
    role: "alert",
  },
  render: function AlertRender({
    severity,
    title,
    variant,
    size,
    closable,
    onClose,
    icon,
    children,
    ref,
    ...rest
  }) {
    return (
      <Flex ref={ref} mod={{ size, variant }} {...rest}>
        <Box as="span" flexShrink={0} aria-hidden>
          {icon}
        </Box>
        <Box flex={1}>
          {title && (
            <Text as="p" weight={600} mb="xs" apply="@noMargin">
              {title}
            </Text>
          )}
          {children && <Box>{children}</Box>}
        </Box>
        {closable && (
          <Box
            as="button"
            flexShrink={0}
            onClick={onClose}
            aria-label="Cerrar alerta"
            apply="@resetButton"
          >
            ✕
          </Box>
        )}
      </Flex>
    );
  },
});
