import { useState } from "react";
import { ComponentFactory, type ComponentConfig, type EmptyStatics } from "../../factory";
import { Box } from "../Primitives/Box";
import { Flex } from "../Primitives/Flex/Flex";
import { useResolvedSize } from "../../hooks";
import type { ScaleRange } from "../../theme";

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
  sizes: ScaleRange<"xs" | "sm" | "md" | "lg" | "xl">;
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
    shape: "circle",
    size: "md",
    display: "inline-flex",
    overflow: "hidden",
    flexShrink: 0,
    userSelect: "none",
  },
  render: function AvatarRender({ src, alt, name, size, shape, children, ref, ...rest }) {
    const resolvedSize = useResolvedSize(size);
    const [imgError, setImgError] = useState(false);

    if (src && !imgError) {
      return (
        <Box
          ref={ref}
          align="center"
          justify="center"
          role="img"
          aria-label={alt ?? name}
          mod={{ size: resolvedSize }}
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
        role="img"
        aria-label={alt ?? name}
        fontWeight={600}
        mod={{ size: resolvedSize }}
        rounded={shape === "circle" ? "full" : "md"}
        {...rest}
      >
        {children ?? (name ? getInitials(name) : "?")}
      </Flex>
    );
  },
});
