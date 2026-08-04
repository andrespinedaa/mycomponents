import type { ComponentStates } from "../";
import { buildSlotSelector, generateTokensCSS, STATE_SELECTORS, type GeneratorNames } from "./css-gen-utils";
import type { ParsedBlock, ParsedStateNode, ParsedVariants } from "./parseComponentConfig";

export function emitStateRules(
  selector: string,
  states: Array<[ComponentStates, ParsedStateNode]>,
  prefix: string,
  tokenVars: Record<string, string>,
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
  return (body ? `${selector}{${body}}` : "") +
    emitStateRules(selector, block.states, prefix, tokenVars, parentPrefix);
}

export function generateComponentVariants(
  names: GeneratorNames,
  variants: ParsedVariants | undefined,
  tokenVars: Record<string, string>,
): string {
  if (!variants) return "";
  const { resolvedName, prefix, parentPrefix } = names;
  const baseSelector = buildSlotSelector(resolvedName);

  let css = emitBlock(baseSelector, variants, prefix, tokenVars, parentPrefix);
  for (const [variantName, block] of variants.entries) {
    css += emitBlock(
      `${baseSelector}[data-variant="${variantName}"]`,
      block, prefix, tokenVars, parentPrefix,
    );
  }
  return css;
}
