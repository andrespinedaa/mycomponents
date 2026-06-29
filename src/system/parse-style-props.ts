import type { CSSProperties } from "react";
import { STYLE_PROPS_DATA } from "../theme/generators/system-css.data";
import type { StyleProps } from "../theme/generators/system-css.data";
import type { Theme } from "../theme/theme.types";
import { resolveValue } from "./resolve-value";
import { isResponsiveObject, cssPropToVarKey } from "./responsive.data";

export type ParsedStyleProps = {
  styles: CSSProperties;
  hasResponsive: boolean;
};

export function parseStyleProps(
  styleProps: StyleProps,
  theme: Theme,
): ParsedStyleProps {
  const result: Record<string, string | number> = {};
  let hasResponsive = false;

  for (const [prop, value] of Object.entries(styleProps)) {
    if (value === undefined || value === null) continue;

    const def = STYLE_PROPS_DATA[prop];
    if (!def) continue;
    const { properties, category, responsive: isResponsiveProp } = def;

    // ── Camino responsive ──────────────────────────────────────────────────
    if (isResponsiveObject(value)) {
      if (!isResponsiveProp) {
        const baseValue = (value as Record<string, unknown>).base;
        if (baseValue !== undefined && baseValue !== null) {
          const resolved = resolveValue(
            baseValue as string | number,
            category,
            theme,
          );
          for (const cssProp of properties) {
            result[cssProp] = resolved;
          }
        }
        continue;
      }

      for (const [breakpoint, bpValue] of Object.entries(value)) {
        if (bpValue === undefined || bpValue === null) continue;
        const resolved = resolveValue(
          bpValue as string | number,
          category,
          theme,
        );
        for (const cssProp of properties) {
          result[`--${cssPropToVarKey(cssProp)}-${breakpoint}`] = resolved;
        }
        hasResponsive = true;
      }
      continue;
    }

    // ── Camino directo ─────────────────────────────────────────────────────
    const resolved = resolveValue(value as string | number, category, theme);
    for (const cssProp of properties) {
      result[cssProp] = resolved;
    }
  }

  return { styles: result as CSSProperties, hasResponsive };
}
