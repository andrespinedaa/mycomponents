import type { CSSProperties } from "react";

export const typographyMacros = {
  "@lineClamp": {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: "var(--line-clamp, 3)",
    overflow: "hidden",
  },
  "@inherit":    { font: "inherit", color: "inherit", lineHeight: "inherit", textAlign: "inherit" },
  "@inheritAll": { all: "inherit" },
  "@truncate":   { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
} satisfies Record<`@${string}`, CSSProperties>;
