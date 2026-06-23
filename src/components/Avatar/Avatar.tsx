import { useState } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";
import type { SpacingValue } from "../../theme/generators/system-css.data";

export interface AvatarOwnProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: SpacingValue | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
}

export type AvatarConfig = ComponentConfig<{
  componentName: "Avatar";
  defaultTag: "div";
  ownProps: AvatarOwnProps;
  statics: EmptyStatics;
  defaultProps: { shape: "circle"; size: "md" };
}>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZE_MAP: Record<string, string> = {
  sm: "2rem",
  md: "2.5rem",
  lg: "3rem",
  xl: "4rem",
};

export const Avatar = ComponentFactory<AvatarConfig>({
  componentName: "Avatar",
  defaultTag: "div",
  defaultProps: { shape: "circle", size: "md" },
  render: ({ src, alt, name, size = "md", shape = "circle", ...rest }) => {
    const [imgError, setImgError] = useState(false);
    const dimension = SIZE_MAP[size] ?? (size as string);
    const radius = shape === "circle" ? "50%" : "var(--mycomponents-radius-md)";

    const baseStyle: React.CSSProperties = {
      width: dimension,
      height: dimension,
      borderRadius: radius,
      overflow: "hidden",
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: `calc(${dimension} * 0.4)`,
      fontWeight: 600,
      userSelect: "none",
    };

    if (src && !imgError) {
      return (
        <Box as="div" style={baseStyle} {...rest}>
          <img
            src={src}
            alt={alt ?? name ?? "avatar"}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      );
    }

    return (
      <Flex
        apply="@flexCenter"
        style={baseStyle}
        aria-label={alt ?? name}
        role="img"
        {...rest}
      >
        {name ? getInitials(name) : "?"}
      </Flex>
    );
  },
});
