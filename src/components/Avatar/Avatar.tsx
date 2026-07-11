import { useState } from "react";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { useResolveLayout } from "../../hooks";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";

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
  statics: EmptyStatics;
  defaultProps: {
    shape: "circle";
    size: "md";
    display: "inline-flex";
    overflow: "hidden";
    flexShrink: 0;
    userSelect: "none";
  };
  sizes: "xs" | "sm" | "md" | "lg" | "xl";
  presets: string;
  variants: "Default";
}>;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = ComponentFactory<AvatarConfig>({
  componentName: "Avatar",
  defaultTag: "div",
  defaultProps: {
    size: "md",
    role: "img",
    flexShrink: 0,
    shape: "circle",
    overflow: "hidden",
    userSelect: "none",
    display: "inline-flex",
  },
  render: function AvatarRender({
    src,
    alt,
    ref,
    name,
    shape,
    children,
    size: sizeProp,
    variant: variantProp,
    ...rest
  }) {
    const { size, variant } = useResolveLayout({ size: sizeProp, variant: variantProp });
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
      <Flex
        ref={ref}
        apply="@flexCenter"
        aria-label={alt ?? name}
        fontWeight={600}
        mod={{ size }}
        rounded={shape === "circle" ? "full" : "md"}
        {...rest}
      >
        {children ?? (name ? getInitials(name) : "?")}
      </Flex>
    );
  },
});
