/**
 * Registry lazy de CSS — inject once per session, never remove.
 * Misma estrategia de Emotion / MUI: insertar una vez, no borrar.
 *
 * Usa insertRule() en lugar de textContent += para evitar re-parsear
 * el stylesheet completo en cada inserción (O(1) por regla vs O(n) total).
 *
 * resetRegistry() se llama desde ThemeProvider en su cleanup para:
 *   - Strict Mode (React 18 dev monta → limpia → monta dos veces)
 *   - Cambio de tema en runtime
 */
const injected = new Set<string>();

let basesEl: HTMLStyleElement | null = null;
let variantsEl: HTMLStyleElement | null = null;
let sizesEl: HTMLStyleElement | null = null;

function getEl(sheet: "bases" | "variants" | "sizes"): HTMLStyleElement {
  const existing =
    sheet === "bases" ? basesEl : sheet === "variants" ? variantsEl : sizesEl;
  if (existing) return existing;
  const el = document.createElement("style");
  el.setAttribute("data-mycomponents", sheet);
  document.head.appendChild(el);
  if (sheet === "bases") basesEl = el;
  else if (sheet === "variants") variantsEl = el;
  else sizesEl = el;
  return el;
}

function insertRules(el: HTMLStyleElement, css: string): void {
  const sheet = el.sheet;
  if (!sheet) return;
  const rules =
    css.match(/@[^{]+\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|[^{}]+\{[^{}]*\}/g) ?? [];
  for (const rule of rules) {
    try {
      sheet.insertRule(rule.trim(), sheet.cssRules.length);
    } catch {
      // Regla inválida — ignorar silenciosamente
    }
  }
}

export function registerComponentCSS(
  componentName: string,
  basesCSS: string,
  variantsCSS: string,
  sizesCSS = "",
): void {
  if (injected.has(componentName)) return;
  injected.add(componentName);
  if (basesCSS) insertRules(getEl("bases"), basesCSS);
  if (variantsCSS) insertRules(getEl("variants"), variantsCSS);
  if (sizesCSS) insertRules(getEl("sizes"), sizesCSS);
}

export function resetRegistry(): void {
  injected.clear();
  basesEl?.remove();
  basesEl = null;
  variantsEl?.remove();
  variantsEl = null;
  sizesEl?.remove();
  sizesEl = null;
}
