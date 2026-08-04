import { camelToKebab } from "../../utils/string";
import type { Theme, VarsCss } from "../core/theme.types";

interface TokenRecord {
  [key: string]: TokenValue;
}
type TokenValue = string | number | TokenRecord;

interface createTokensReturn {
  css: string;
  vars: VarsCss;
}

function createTokens(
  prefix: string,
  tokens: Record<string, TokenValue>,
  suffix: string = "",
): createTokensReturn {
  let css = "";
  const vars: VarsCss = {};

  for (const [k, value] of Object.entries(tokens)) {
    const key = suffix ? `${suffix}-${camelToKebab(k)}` : camelToKebab(k);
    if (typeof value === "object") {
      const subTokens = createTokens(prefix, value, key);
      css += subTokens.css;
      Object.assign(vars, subTokens.vars);
    } else {
      css += `--${prefix}-${key}:${value};`;
      vars[key] = `var(--${prefix}-${key})`;
    }
  }

  return { css, vars };
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

export function generateTokens(theme: Theme): { tokens: string; vars: VarsCss } {
  const allVars: VarsCss = {};
  let css = ":root{";

  for (const category of [
    theme.motion,
    theme.typography,
    { colors: theme.colors },
    { radius: theme.radius },
    { shadow: theme.shadow },
    { spacing: theme.spacing },
    { fontSizes: theme.fontSizes },
  ]) {
    const tokens = createTokens(theme.prefix, category as Record<string, TokenValue>);
    css += tokens.css;
    Object.assign(allVars, tokens.vars);
  }

  if (theme.semantic?.dark) css += createSemanticTokens(theme.prefix, theme.semantic.dark);

  css += "}";

  if (theme.dark?.colors || theme.dark?.shadow || theme.dark?.semantic) {
    css += "[data-color-scheme=dark]{";
    if (theme.dark.colors) {
      const { css: c } = createTokens(theme.prefix, {
        colors: theme.dark.colors as Record<string, TokenValue>,
      });
      css += c;
    }
    if (theme.dark.shadow) {
      const { css: c } = createTokens(theme.prefix, {
        shadow: theme.dark.shadow as Record<string, string>,
      });
      css += c;
    }
    if (theme.dark.semantic) css += createSemanticTokens(theme.prefix, theme.dark.semantic);
    css += "}";
  }

  if (theme.semantic?.light) {
    css += "[data-color-scheme=light]{";
    css += createSemanticTokens(theme.prefix, theme.semantic.light);
    css += "}";
  }

  return { tokens: css, vars: allVars };
}
