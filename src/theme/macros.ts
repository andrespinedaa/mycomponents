import type { CSSProperties } from "react";

// theme/macros.ts
export type StyleMacro = CSSProperties;

export type Macros = Record<`@${string}`, StyleMacro>;

export const defaultMacros: Macros = {
  // Layout comunes
  "@flexCenter": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "@flexBetween": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "@flexCol": {
    display: "flex",
    flexDirection: "column",
  },
  "@flexColCenter": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // Posicionamiento
  "@absoluteFill": {
    position: "absolute",
    inset: 0,
  },
  "@fixedFill": {
    position: "fixed",
    inset: 0,
  },

  // Tipografía
  "@truncate": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
};
