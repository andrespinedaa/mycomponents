import { camelToKebab } from "../../utils/string";
import type { Theme, VarsCss } from "../core/theme.types";

interface TokenRecord {
  [key: string]: TokenValue;
}
type TokenValue = string | number | TokenRecord;

function createTokens(
  prefix: string,
  tokens: Record<string, TokenValue>,
  suffix = "",
): { css: string; vars: VarsCss } {
  let css = "";
  const vars: VarsCss = {};

  for (const [k, value] of Object.entries(tokens)) {
    const key = suffix ? `${suffix}-${camelToKebab(k)}` : camelToKebab(k);
    if (typeof value === "object") {
      const child = createTokens(prefix, value as Record<string, TokenValue>, key);
      css += child.css;
      Object.assign(vars, child.vars);
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

export function generateTokens(theme: Theme): { css: string; vars: VarsCss } {
  const allVars: VarsCss = {};
  let css = ":root{";

  const collect = (tokens: Record<string, TokenValue>): string => {
    const { css: c, vars } = createTokens(theme.prefix, tokens);
    Object.assign(allVars, vars);
    return c;
  };

  css += collect(theme.motion);
  css += collect(theme.typography);
  css += collect({ colors: theme.colors });
  css += collect({ radius: theme.radius });
  css += collect({ shadow: theme.shadow });
  css += collect({ spacing: theme.spacing });
  css += collect({ fontSizes: theme.fontSizes });

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

  return { css, vars: allVars };
}
