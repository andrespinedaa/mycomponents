import { useState } from "react";
import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box } from "../Primitives/Box";

export interface AvatarOwnProps {
  src?: string;
  alt?: string;
  name?: string;
  shape?: "circle" | "square";
}

export type AvatarConfig = ComponentConfig<{
  componentName: "Avatar";
  defaultTag: "div";
  ownProps: AvatarOwnProps;
  defaultProps: {
    shape: "circle";
    userSelect: "none";
  };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled";
}>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = ComponentFactory<AvatarConfig>({
  componentName: "Avatar",
  defaultProps: { role: "img", shape: "circle", userSelect: "none" },
  render: function AvatarRender({
    src,
    alt,
    ref,
    name,
    size,
    shape,
    variant,
    children,
    ...rest
  }) {
    const [imgError, setImgError] = useState(false);

    if (src && !imgError) {
      return (
        <Box
          ref={ref}
          align="center"
          justify="center"
          aria-label={alt ?? name}
          mod={{ size, variant }}
          rounded={shape === "circle" ? "full" : "md"}
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
      <Box
        ref={ref}
        apply="@flexCenterCenter"
        aria-label={alt ?? name}
        fontWeight={600}
        mod={{ size, variant }}
        rounded={shape === "circle" ? "full" : "md"}
        {...rest}
      >
        {children ?? (name ? getInitials(name) : "?")}
      </Box>
    );
  },
});
