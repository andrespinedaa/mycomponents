import { useState } from "react";
import { ComponentFactory, type ComponentConfig } from "../../factory";
import { Box, Image } from "../Primitives";

export interface AvatarOwnProps {
  src?: string;
  alt?: string;
  name?: string;
  shape?: "circle" | "square";
}

export type AvatarConfig = ComponentConfig<{
  tag: "div";
  name: "Avatar";
  ownProps: AvatarOwnProps;
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  variants: "Filled" | "Outlined" | "Elevated";
}>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = ComponentFactory<AvatarConfig>({
  name: "Avatar",
  render: function AvatarRender({
    src,
    alt,
    ref,
    children,
    role = "img",
    name = "avatar",
    shape = "circle",
    variant = "Filled",
    userSelect = "none",
    ...rest
  }) {
    const [imgError, setImgError] = useState(false);

    if (src && !imgError) {
      return (
        <Box
          ref={ref}
          variant={variant}
          aria-label={alt ?? name}
          apply="@flexCenterCenter"
          rounded={shape === "circle" ? "full" : "md"}
          {...rest}
        >
          <Image
            w="100%"
            h="100%"
            src={src}
            objectFit="cover"
            alt={alt ?? name}
            onError={() => setImgError(true)}
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
        variant={variant}
        rounded={shape === "circle" ? "full" : "md"}
        {...rest}
      >
        {children ?? (name ? getInitials(name) : "?")}
      </Box>
    );
  },
});
