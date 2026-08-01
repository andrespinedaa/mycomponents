import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box, Text } from "../Primitives";

export type AlertSeverity = "info" | "success" | "warning" | "danger";

export interface AlertOwnProps {
  severity?: AlertSeverity;
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export type AlertConfig = ComponentConfig<{
  tag: "div";
  name: "Alert";
  ownProps: AlertOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Subtle" | "Filled" | "Outlined";
}>;

export const Alert = ComponentFactory<AlertConfig>({
  name: "Alert",
  render: ({
    ref,
    icon,
    title,
    onClose,
    closable,
    children,
    role = "alert",
    severity = "info",
    variant = "Filled",
    ...rest
  }) => {
    return (
      <Box ref={ref} variant={variant} {...rest}>
        <Box as="span" flexShrink={0} aria-hidden>
          {icon}
        </Box>
        <Box flex={1}>
          {title && (
            <Text fontWeight="600px" mb="xs" apply="@noMargin">
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
      </Box>
    );
  },
});
