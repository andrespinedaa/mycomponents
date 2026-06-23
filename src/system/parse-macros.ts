// utils/resolve-macros.ts
import type { CSSProperties } from "react";
import type { ApplyProp, ThemeMacros } from "../factory/factories.types";
import {
  ALIGNS,
  FLEX_DISPLAYS,
  GRID_DISPLAYS,
  JUSTIFY_CONTENTS,
  JUSTIFY_ITEMS,
} from "../theme/theme.macros.data";
import type {
  FlexMacros,
  GridMacros,
  Macros,
} from "../theme/theme.macros.types";

// ─── Helpers ──────────────────────────────────────────────────
export const startsWithMacros = (v: string, ...prefixes: string[]) =>
  prefixes.some((p) => v.startsWith(p));

export const isFlexMacro = (v: string): v is FlexMacros =>
  startsWithMacros(v, "@flex", "@inlineFlex");

export const isGridMacro = (v: string): v is GridMacros =>
  startsWithMacros(v, "@grid", "@inlineGrid");

export function macroToCssValue<T extends string>(value: T): string {
  return value
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

// ─── Parser factory con pre-sort ──────────────────────────────
type MacroSchema = Record<string, readonly string[]>;

export function createMacroParser<TMacro extends string>(schema: MacroSchema) {
  const sortedSchema = Object.fromEntries(
    Object.entries(schema).map(([key, opts]) => [
      key,
      [...opts].sort((a, b) => b.length - a.length),
    ]),
  );

  return (macro: TMacro): Record<string, string> => {
    let rest = macro.slice(1);
    const result: Record<string, string> = {};

    for (const key in sortedSchema) {
      const match = sortedSchema[key].find((v) => rest.startsWith(v));
      if (!match) throw new Error(`Cannot parse "${rest}" in macro "${macro}"`);
      result[key] = macroToCssValue(match);
      rest = rest.slice(match.length);
    }

    if (rest.length > 0) {
      throw new Error(`Unexpected token "${rest}" in macro "${macro}"`);
    }

    return result;
  };
}

// ─── Parsers ─────────────────────────────────────────────────

export const parseFlexMacros = createMacroParser<FlexMacros>({
  display: FLEX_DISPLAYS,
  alignItems: ALIGNS,
  justifyContent: JUSTIFY_CONTENTS,
});

export const parseGridMacros = createMacroParser<GridMacros>({
  display: GRID_DISPLAYS,
  alignItems: ALIGNS,
  justifyItems: JUSTIFY_ITEMS,
});

// ─── Resolver principal ───────────────────────────────────────
function resolveItem(item: ApplyProp, macros?: Macros): CSSProperties | null {
  const custom = macros?.[item as keyof ThemeMacros];
  if (custom) return custom;

  if (typeof item === "string") {
    if (isFlexMacro(item)) return parseFlexMacros(item) as CSSProperties;
    if (isGridMacro(item)) return parseGridMacros(item) as CSSProperties;
  }

  if (!custom) {
    console.warn(`Macro "${String(item)}" not found`);
  }

  return null;
}

export function resolveMacros(
  apply: ApplyProp | ApplyProp[] | undefined,
  macros?: Macros,
): CSSProperties {
  if (!apply) return {};
  const keys = Array.isArray(apply) ? apply : [apply];
  return keys.reduce<CSSProperties>((acc, item) => {
    const resolved = resolveItem(item, macros);
    return resolved ? { ...acc, ...resolved } : acc;
  }, {});
}
