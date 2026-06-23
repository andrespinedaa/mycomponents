import { useState } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../factory";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";

export interface AvatarOwnProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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

export const Avatar = ComponentFactory<AvatarConfig>({
  componentName: "Avatar",
  defaultTag: "div",
  defaultProps: { shape: "circle", size: "md" },
  render: ({ src, alt, name, size: _size, shape = "circle", children, ...rest }, ref) => {
    const [imgError, setImgError] = useState(false);

    // w, h, fontSize are resolved from theme sizes → come in via ...rest as style props
    const shapeStyle: React.CSSProperties = {
      borderRadius: shape === "circle" ? "50%" : undefined,
      overflow: "hidden",
      flexShrink: 0,
      userSelect: "none",
    };

    if (src && !imgError) {
      return (
        <Box
          ref={ref}
          display="inline-flex"
          align="center"
          justify="center"
          role="img"
          aria-label={alt ?? name}
          style={shapeStyle}
          rounded={shape === "square" ? "md" : undefined}
          {...rest}
        >
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
        ref={ref}
        apply="@flexCenter"
        role="img"
        aria-label={alt ?? name}
        fontWeight={600}
        style={shapeStyle}
        rounded={shape === "square" ? "md" : undefined}
        {...rest}
      >
        {children ?? (name ? getInitials(name) : "?")}
      </Flex>
    );
  },
});
