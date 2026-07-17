import type { CSSProperties } from "react";

export const resetMacros = {
  "@noMargin": { margin: 0 },
  "@inputReset": {
    flex: "1",
    height: "100%",
    border: "none",
    background: "transparent",
    outline: "none",
    font: "inherit",
    color: "inherit",
    minWidth: 0,
    padding: 0,
  },
  "@resetButton": {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "inherit",
    lineHeight: 1,
    font: "inherit",
  },
  "@srOnly": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Record<`@${string}`, CSSProperties>;
