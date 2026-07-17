import type { CSSProperties } from "react";

// prettier-ignore
export const gradientMacros = {
  "@fadeDown":  { background: "linear-gradient(to bottom, var(--gradient-from, currentColor) var(--gradient-stop, 0%), transparent)" },
  "@fadeUp":    { background: "linear-gradient(to top,    var(--gradient-from, currentColor) var(--gradient-stop, 0%), transparent)" },
  "@fadeRight": { background: "linear-gradient(to right,  var(--gradient-from, currentColor) var(--gradient-stop, 0%), transparent)" },
  "@fadeLeft":  { background: "linear-gradient(to left,   var(--gradient-from, currentColor) var(--gradient-stop, 0%), transparent)" },
} satisfies Record<`@${string}`, CSSProperties>;
