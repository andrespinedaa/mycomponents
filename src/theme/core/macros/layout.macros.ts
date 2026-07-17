import type { CSSProperties } from "react";

// prettier-ignore
export const layoutMacros = {
  "@flexColCenter": { display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" },
  "@flexBetween":   { display: "flex", alignItems: "center", justifyContent: "space-between" },
  "@flexCenter":    { display: "flex", alignItems: "center", justifyContent: "center" },
  "@flexCol":       { display: "flex", flexDirection: "column" },
} satisfies Record<`@${string}`, CSSProperties>;
