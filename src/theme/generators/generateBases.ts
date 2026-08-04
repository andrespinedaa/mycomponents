import { camelToKebab } from "../../utils/string";
import type { UsedKeys } from "./css-gen-utils";
import type { GeneratorNames } from "./generateComponents";
import { STYLE_PROPS_DATA } from "./system-css.data";

export function generateComponentBases(names: GeneratorNames, usedKeys: UsedKeys): string {
  if (usedKeys.size === 0) return "";
  let css = `${names.selector}{`;
  for (const key of usedKeys) {
    const properties = STYLE_PROPS_DATA[key]?.properties ?? [key];
    for (const prop of properties) {
      const kebab = camelToKebab(prop);
      css += `${kebab}:var(--${names.prefix}-${kebab},unset);`;
    }
  }
  return css + "}";
}
