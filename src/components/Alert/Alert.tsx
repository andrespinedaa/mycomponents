import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import type { Variant } from "../../theme/theme.variants";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";
import { Text } from "../Primitives/Text/Text";

export type AlertSeverity = "info" | "success" | "warning" | "danger";

export interface AlertOwnProps {
  severity?: AlertSeverity;
  title?: string;
  variant?: Variant<"Subtle" | "Filled" | "Outlined">;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export type AlertConfig = ComponentConfig<{
  componentName: "Alert";
  defaultTag: "div";
  ownProps: AlertOwnProps;
  statics: EmptyStatics;
  defaultProps: { severity: "info"; variant: "Subtle" };
}>;

const SEVERITY_TOKENS: Record<AlertSeverity, { color: string; bg: string; border: string }> = {
  info:    { color: "primary.700",  bg: "primary.50",  border: "primary.200"  },
  success: { color: "success.700",  bg: "success.50",  border: "success.200"  },
  warning: { color: "warning.700",  bg: "warning.50",  border: "warning.200"  },
  danger:  { color: "danger.700",   bg: "danger.50",   border: "danger.200"   },
};

const DEFAULT_ICONS: Record<AlertSeverity, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✕",
};

export const Alert = ComponentFactory<AlertConfig>({
  componentName: "Alert",
  defaultTag: "div",
  defaultProps: { severity: "info", variant: "Subtle" },
  render: ({ severity = "info", title, variant: _variant, closable, onClose, icon, children, ...rest }) => {
    const tokens = SEVERITY_TOKENS[severity];
    return (
      <Flex
        role="alert"
        gap="sm"
        p="md"
        rounded="md"
        bg={tokens.bg as any}
        color={tokens.color as any}
        borderColor={tokens.border as any}
        border="1px solid"
        {...rest}
      >
        <Box as="span" flexShrink={0} aria-hidden>
          {icon ?? DEFAULT_ICONS[severity]}
        </Box>
        <Box flex={1}>
          {title && (
            <Text as="p" weight={600} mb="xs" style={{ margin: 0 }}>
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
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              color: "inherit",
              lineHeight: 1,
            }}
          >
            ✕
          </Box>
        )}
      </Flex>
    );
  },
});
