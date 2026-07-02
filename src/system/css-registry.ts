type ComponentCSS = { bases: string; variants: string; sizes: string };

const registry = new Map<string, ComponentCSS>();

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

function rebuildStyles(): void {
  const values = [...registry.values()];
  getEl("bases").textContent    = values.map((v) => v.bases).join("");
  getEl("variants").textContent = values.map((v) => v.variants).join("");
  getEl("sizes").textContent    = values.map((v) => v.sizes).join("");
}

export function registerComponentCSS(
  componentName: string,
  basesCSS: string,
  variantsCSS: string,
  sizesCSS = "",
): void {
  const prev = registry.get(componentName);
  const cssChanged =
    !prev ||
    prev.bases !== basesCSS ||
    prev.variants !== variantsCSS ||
    prev.sizes !== sizesCSS;

  // Rebuild si algún elemento fue removido del DOM (ej: DevTools, hot-reload, otro script)
  const elementsGone =
    basesEl === null ||
    variantsEl === null ||
    sizesEl === null ||
    !document.head.contains(basesEl) ||
    !document.head.contains(variantsEl) ||
    !document.head.contains(sizesEl);

  if (!cssChanged && !elementsGone) return;

  if (cssChanged) {
    registry.set(componentName, { bases: basesCSS, variants: variantsCSS, sizes: sizesCSS });
  }
  rebuildStyles();
}

// Solo remueve los elementos del DOM — conserva el Map para detectar cambios de CSS
export function resetRegistry(): void {
  basesEl?.remove();    basesEl = null;
  variantsEl?.remove(); variantsEl = null;
  sizesEl?.remove();    sizesEl = null;
}
