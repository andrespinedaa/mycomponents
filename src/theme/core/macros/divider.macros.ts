import type { CSSProperties } from "react";

export const dividerMacros = {
  "@dividerLineH": {
    width: "100%",
    borderTopStyle: "solid",
    borderTopWidth: "var(--divider-thickness, 1px)",
  },
  "@dividerLineV": {
    display: "inline-block",
    width: "0",
    alignSelf: "stretch",
    borderLeftStyle: "solid",
    borderLeftWidth: "var(--divider-thickness, 1px)",
  },
} satisfies Record<`@${string}`, CSSProperties>;
