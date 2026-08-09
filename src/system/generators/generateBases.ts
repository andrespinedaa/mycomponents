import { camelToKebab } from "../../utils/string";
import type { GeneratorNames } from "./generateComponents";
import { STYLE_PROPS_LOOKUP } from "../system.data";
import { resolveVarNames } from "./css-gen-utils";

export function generateBases(names: GeneratorNames, usedKeys: Set<string>): string {
  if (usedKeys.size === 0) return "";
  let css = `${names.selector}{`;
  for (const key of usedKeys) {
    const properties = STYLE_PROPS_LOOKUP[key]?.properties ?? [key];
    const varNames = resolveVarNames(key, names.prefix);
    properties.forEach((prop, i) => {
      css += `${camelToKebab(prop)}:var(${varNames[i]},unset);`;
    });
  }
  return css + "}";
}
