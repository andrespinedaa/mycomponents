import { type VarsCss } from "../../theme";
import { camelToKebab, dotToKebab } from "../../utils/string";
import { DSLDollar } from "../../system/generators/css-gen-utils";

function resolveTokenValue(value: string, tokenVars: VarsCss): string | undefined {
  // Regla 2 — color: "primary.500" → colors-primary-500
  if (/^[a-z]\w*\.\d+$/.test(value)) {
    return tokenVars[`colors-${dotToKebab(value)}`];
  }
  // Regla 3 — categoría: "spacing.md", "fontSizes.xl" → lookup en tokenVars
  if (/^[a-z]\w*\.[a-z]/i.test(value)) {
    return tokenVars[dotToKebab(camelToKebab(value))];
  }
  return undefined;
}

export function resolveVars(
  prefix: string,
  varsRaw?: VarsCss,
  tokenVars?: VarsCss,
): VarsCss | undefined {
  if (!varsRaw) return undefined;
  const result: VarsCss = {};
  let changed = false;
  for (const [key, value] of Object.entries(varsRaw)) {
    // Regla 1 — auto-referencia: "$borderColor" → var(--prefix-border-color)
    if (value.includes("$")) {
      result[key] = DSLDollar(value, prefix);
      changed = true;
      continue;
    }
    const resolved = tokenVars ? resolveTokenValue(value, tokenVars) : undefined;
    result[key] = resolved ?? value;
    if (resolved) changed = true;
  }
  return changed ? result : varsRaw;
}
