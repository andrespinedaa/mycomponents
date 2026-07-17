import type { CSSProperties } from "react";

// prettier-ignore
export const positionMacros = {
  "@absoluteFill": { position: "absolute", inset: 0 },
  "@fixedFill":    { position: "fixed",    inset: 0 },
  "@pushLeft":     { marginRight: "auto" },
  "@pushRight":    { marginLeft:  "auto" },
  "@pushTop":      { marginBottom: "auto" },
  "@pushBottom":   { marginTop:   "auto" },
  "@pushCenter":   { margin: "auto" },
} satisfies Record<`@${string}`, CSSProperties>;
