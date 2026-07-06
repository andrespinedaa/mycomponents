# ToDo — Deuda técnica

## Semantic Colors — conectar al sistema

**Archivos:** `src/theme/theme.types.ts` líneas 98–114

`BaseSemanticColors` y `ThemeSemanticLayer` están definidas pero desconectadas del sistema de tipos y del generador CSS. Actualmente son solo una intención.

**Lo que falta para que funcionen:**

1. Extender `ColorValue` con `keyof ThemeSemanticColors` para que `bg="surface"` sea válido en TypeScript.
2. En `resolveValue` (`src/system/resolve-value.ts`) — si el valor es una semantic key, emitir `var(--prefix-semantic-surface)` en lugar de buscar en color scales.
3. En el generador de tokens — emitir las CSS custom properties semánticas bajo `:root` (light) y `.dark` (o `[data-theme="dark"]`) selectors.

**Por qué importa:** sin esto el consumidor no puede usar tokens semánticos para dark mode. Tiene que hardcodear `bg="neutral.50"` en lugar de `bg="surface"`, lo que rompe en dark mode.
