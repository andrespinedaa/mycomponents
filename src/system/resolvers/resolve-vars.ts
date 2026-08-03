import { resolveVarName } from "../../theme/generators/css-gen-utils";

export function resolveVars(
  vars: Record<string, string> | undefined,
  prefix: string,
  tokenVars?: Record<string, string>,
): Record<string, string> | undefined {
  if (!vars) return vars;
  const result: Record<string, string> = {};
  let changed = false;
  for (const [key, value] of Object.entries(vars)) {
    if (value.includes("$")) {
      result[key] = value.replace(/\$(\w+)/g, (_, prop) => `var(${resolveVarName(prop, prefix)})`);
      changed = true;
    } else if (tokenVars) {
      const colorMatch = value.match(/^([a-z]+)\.(\d+)$/);
      if (colorMatch) {
        const [, name, shade] = colorMatch;
        const varKey = `colors-${name}-${shade}`;
        if (tokenVars[varKey]) {
          result[key] = tokenVars[varKey];
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
