import { camelToKebab } from "../../utils/string";
import type { Theme, VarsCss } from "../../theme/theme.types";

interface TokenRecord {
  [key: string]: TokenValue;
}
type TokenValue = string | number | TokenRecord;

interface TokensVarsReturn {
  tokens: string;
  vars: VarsCss;
}

function createTokens(
  prefix: string,
  category: Record<string, TokenValue>,
  suffix: string = "",
): TokensVarsReturn {
  const vars: VarsCss = {};
  let tokens = "";

  for (const [k, value] of Object.entries(category)) {
    const key = suffix ? `${suffix}-${camelToKebab(k)}` : camelToKebab(k);
    if (typeof value === "object") {
      const subTokens = createTokens(prefix, value, key);
      tokens += subTokens.tokens;
      Object.assign(vars, subTokens.vars);
    } else {
      tokens += `--${prefix}-${key}:${value};`;
      vars[key] = `var(--${prefix}-${key})`;
    }
  }

  return { tokens, vars };
}

function resolveSemanticRef(value: string, prefix: string): string {
  const match = value.match(/^([a-z]+)\.(\d+)$/);
  if (match) return `var(--${prefix}-colors-${match[1]}-${match[2]})`;
  return value;
}

function createSemanticTokens(prefix: string, tokens: Record<string, string | undefined>): string {
  let css = "";
  for (const [key, value] of Object.entries(tokens)) {
    if (!value) continue;
    css += `--${prefix}-color-${camelToKebab(key)}:${resolveSemanticRef(value, prefix)};`;
  }
  return css;
}

export function generateTokens(theme: Theme): TokensVarsReturn {
  const vars: VarsCss = {};
  let tokens = ":root{";

  for (const category of [
    theme.motion,
    theme.typography,
    { colors: theme.colors },
    { radius: theme.radius },
    { shadow: theme.shadow },
    { spacing: theme.spacing },
    { fontSizes: theme.fontSizes },
  ]) {
    const tokenVars = createTokens(theme.prefix, category as TokenRecord);
    tokens += tokenVars.tokens;
    Object.assign(vars, tokenVars.vars);
  }

  if (theme.semantic?.dark) tokens += createSemanticTokens(theme.prefix, theme.semantic.dark);

  tokens += "}";

  if (theme.dark?.colors || theme.dark?.shadow || theme.dark?.semantic) {
    tokens += "[data-color-scheme=dark]{";
    if (theme.dark.colors) {
      tokens += createTokens(theme.prefix, {
        colors: theme.dark.colors as TokenRecord,
      }).tokens;
    }
    if (theme.dark.shadow) {
      tokens += createTokens(theme.prefix, {
        shadow: theme.dark.shadow as Record<string, string>,
      }).tokens;
    }
    if (theme.dark.semantic) tokens += createSemanticTokens(theme.prefix, theme.dark.semantic);
    tokens += "}";
  }

  if (theme.semantic?.light) {
    tokens += "[data-color-scheme=light]{";
    tokens += createSemanticTokens(theme.prefix, theme.semantic.light);
    tokens += "}";
  }

  return { tokens, vars };
}
