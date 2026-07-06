import type { PropCategory } from "../theme/generators/system-css.types";
import type { Theme } from "../theme/core/theme.types";

const SIZE_ALIASES: Record<string, string> = {
  full: "100%",
  screen: "100vw",
  fit: "fit-content",
  auto: "auto",
};

export function resolveValue(
  value: string | number,
  category: PropCategory,
  theme: Theme,
): string {
  const v = String(value);
  const p = theme.cssVarPrefix;

  if (category === "raw") return v;

  if (category === "spacing") {
    if (v in SIZE_ALIASES) return SIZE_ALIASES[v];
    if (v in theme.spacing) return `var(--${p}-spacing-${v})`;
    return v;
  }

  if (category === "color") {
    const match = v.match(/^([a-z]+)\.(\d+)$/);
    if (match) {
      const [, name, shade] = match;
      if ((theme.colors[name as keyof typeof theme.colors] as Record<string, unknown>)?.[shade]) {
        return `var(--${p}-color-${name}-${shade})`;
      }
    }
    return v;
  }

  if (category === "radius") {
    if (v in theme.radii) return `var(--${p}-radius-${v})`;
    return v;
  }

  if (category === "fontSize") {
    if (v in theme.fontSizes) return `var(--${p}-font-size-${v})`;
    return v;
  }

  return v;
}
