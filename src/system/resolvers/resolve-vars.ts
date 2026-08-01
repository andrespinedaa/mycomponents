import type { Theme } from "../../theme/core/theme.types";
import { resolveVarName } from "../../theme/generators/css-gen-utils";

export function resolveVars(
  vars: Record<string, string> | undefined,
  prefix: string,
  theme?: Theme,
): Record<string, string> | undefined {
  if (!vars) return vars;
  const result: Record<string, string> = {};
  let changed = false;
  for (const [key, value] of Object.entries(vars)) {
    if (value.includes("$")) {
      result[key] = value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, prefix)})`);
      changed = true;
    } else if (theme) {
      const colorMatch = value.match(/^([a-z]+)\.(\d+)$/);
      if (colorMatch) {
        const [, name, shade] = colorMatch;
        if ((theme.colors[name as keyof typeof theme.colors] as Record<string, unknown>)?.[shade]) {
          result[key] = `var(--${theme.cssVarPrefix}-color-${name}-${shade})`;
          changed = true;
          continue;
        }
      }
      result[key] = value;
    } else {
      result[key] = value;
    }
  }
  return changed ? result : vars;
}
