import { type ComponentStates, type VarsCss } from "../../theme";
import { STATE_SELECTORS } from "../system.data";
import { generateTokensCSS } from "./css-gen-utils";
import type { GeneratorNames } from "./generateComponents";
import type { ParsedBlock, ParsedStateNode, ParsedVariants } from "./parseComponentConfig";

function emitStateRules(
  selector: string,
  states: Array<[ComponentStates, ParsedStateNode]>,
  prefix: string,
  tokenVars: VarsCss,
  parentPrefix: string | undefined,
): string {
  let css = "";
  for (const [stateKey, { flat, nested }] of states) {
    const stateSel = STATE_SELECTORS[stateKey];
    const body = generateTokensCSS(flat, prefix, tokenVars, parentPrefix);
    if (body) css += `${selector}${stateSel}{${body}}`;
    for (const [nestedKey, nestedFlat] of nested) {
      const nestedSel = STATE_SELECTORS[nestedKey];
      const nestedBody = generateTokensCSS(nestedFlat, prefix, tokenVars, parentPrefix);
      if (nestedBody) css += `${selector}${stateSel}${nestedSel}{${nestedBody}}`;
    }
  }
  return css;
}

export function emitBlock(
  selector: string,
  block: ParsedBlock,
  prefix: string,
  tokenVars: Record<string, string>,
  parentPrefix: string | undefined,
): string {
  const body = generateTokensCSS(block.flat, prefix, tokenVars, parentPrefix);
  return (
    (body ? `${selector}{${body}}` : "") +
    emitStateRules(selector, block.states, prefix, tokenVars, parentPrefix)
  );
}

export function generateVariants(
  names: GeneratorNames,
  variants: ParsedVariants | undefined,
  tokenVars: VarsCss,
): string {
  if (!variants) return "";

  let css = emitBlock(names.selector, variants, names.prefix, tokenVars, names.parentPrefix);
  for (const [variantName, block] of variants.entries) {
    css += emitBlock(
      `${names.selector}[data-variant="${variantName}"]`,
      block,
      names.prefix,
      tokenVars,
      names.parentPrefix,
    );
  }
  return css;
}
