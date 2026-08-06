import type { CSSProperties } from "react";
import type { Macros } from "./theme.macros.types";

const layoutSet: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

// prettier-ignore
export const layoutMacros = {
  "@flexColCenter": { alignItems: "center", ...layoutSet },
  "@flexColStart":  { alignItems: "start",  ...layoutSet },
  "@flexCol":       { display: "flex", flexDirection: "column"},
} satisfies Macros;
