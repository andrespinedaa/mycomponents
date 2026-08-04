import { camelToKebab } from "../../utils/string";
import { buildSlotSelector, type GeneratorNames } from "./css-gen-utils";
import { STYLE_PROPS_DATA } from "./system-css.data";

export function generateComponentBases(
  names: GeneratorNames,
  usedKeys: Set<string>,
): string {
  if (usedKeys.size === 0) return "";
  const { resolvedName, prefix } = names;
  const selector = buildSlotSelector(resolvedName);
  let css = `${selector}{`;
  for (const key of usedKeys) {
    const properties = STYLE_PROPS_DATA[key]?.properties ?? [key];
    for (const prop of properties) {
      const kebab = camelToKebab(prop);
      css += `${kebab}:var(--${prefix}-${kebab},unset);`;
    }
  }
  return css + "}";
}
