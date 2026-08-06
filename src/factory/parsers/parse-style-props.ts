import type { CSSProperties } from "react";
import {
  type StyleProps,
  STYLE_PROPS_LOOKUP,
  type Responsive,
  type PartialBreakPointKey,
} from "../../theme";
import { resolveValue } from "../resolvers/resolve-value";
import { camelToKebab } from "../../utils/string";

export type ParsedStyleProps = {
  styles: CSSProperties;
  hasResponsive: boolean;
};

function isResponsiveObject<T>(value: Responsive<T> | undefined): value is PartialBreakPointKey<T> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseStyleProps(
  styleProps: StyleProps,
  tokenVars: Record<string, string>,
): ParsedStyleProps {
  const result: Record<string, string | number> = {};
  let hasResponsive = false;

  for (const [prop, value] of Object.entries(styleProps)) {
    if (value === undefined || value === null) continue;

    const def = STYLE_PROPS_LOOKUP[prop] ?? {
      properties: [prop],
      category: "raw" as const,
      responsive: false,
    };
    const { properties, category, responsive: isResponsiveProp } = def;

    // ── Camino responsive ──────────────────────────────────────────────────
    if (isResponsiveObject(value)) {
      if (!isResponsiveProp) {
        const baseValue = (value as Record<string, unknown>).base;
        if (baseValue !== undefined && baseValue !== null) {
          const resolved = resolveValue(baseValue as string | number, category, tokenVars);
          for (const cssProp of properties) {
            result[cssProp] = resolved;
          }
        }
        continue;
      }

      for (const [breakpoint, bpValue] of Object.entries(value)) {
        if (bpValue === undefined || bpValue === null) continue;
        const resolved = resolveValue(bpValue as string | number, category, tokenVars);
        for (const cssProp of properties) {
          result[`--${camelToKebab(cssProp)}-${breakpoint}`] = resolved;
        }
        hasResponsive = true;
      }
      continue;
    }

    // ── Camino directo ─────────────────────────────────────────────────────
    const resolved = resolveValue(value as string | number, category, tokenVars);
    for (const cssProp of properties) {
      result[cssProp] = resolved;
    }
  }

  return { styles: result as CSSProperties, hasResponsive };
}
