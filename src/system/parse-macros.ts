import type { CSSProperties } from "react";
import type { ApplyProp, ThemeMacros } from "../factory/factories.types";
import {
  ALIGNS,
  FLEX_DISPLAYS,
  GRID_DISPLAYS,
  JUSTIFY_CONTENTS,
  JUSTIFY_ITEMS,
} from "../theme/theme.macros.data";
import type { FlexMacros, GridMacros, Macros } from "../theme/theme.macros.types";

function macroToCssValue<T extends string>(value: T): string {
  return value
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}

type MacroSchema = Record<string, readonly string[]>;

function createMacroParser<TMacro extends string>(schema: MacroSchema) {
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
      if (!match) {
        console.warn(`Cannot parse "${rest}" in macro "${macro}"`);
        return result;
      }
      result[key] = macroToCssValue(match);
      rest = rest.slice(match.length);
    }

    return result;
  };
}

const parseFlexMacro = createMacroParser<FlexMacros>({
  display: FLEX_DISPLAYS,
  alignItems: ALIGNS,
  justifyContent: JUSTIFY_CONTENTS,
});

const parseGridMacro = createMacroParser<GridMacros>({
  display: GRID_DISPLAYS,
  alignItems: ALIGNS,
  justifyItems: JUSTIFY_ITEMS,
});

function isFlexMacro(v: string): v is FlexMacros {
  return v.startsWith("@flex") || v.startsWith("@inlineFlex");
}

function isGridMacro(v: string): v is GridMacros {
  return v.startsWith("@grid") || v.startsWith("@inlineGrid");
}

function resolveItem(item: ApplyProp, macros?: Macros): CSSProperties | null {
  const custom = macros?.[item as keyof ThemeMacros];
  if (custom) return custom;

  if (typeof item === "string") {
    if (isFlexMacro(item)) return parseFlexMacro(item) as CSSProperties;
    if (isGridMacro(item)) return parseGridMacro(item) as CSSProperties;
  }

  console.warn(`Macro "${String(item)}" not found`);
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
