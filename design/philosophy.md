# Filosofía del sistema — MyComponents

## Principio central

Este sistema no es un wrapper de CSS. Es una **infraestructura de composición** que permite construir componentes UI con tipado exacto, temas intercambiables y cero duplicación de boilerplate.

Cada decisión de arquitectura se evalúa contra cinco preguntas antes de implementarse:
1. ¿Ya existe una solución madura? ¿Por qué la hacemos diferente?
2. ¿Cuál es el costo oculto? (bundle, re-renders, tipos, DX)
3. ¿Escala a 50 componentes? ¿Con SSR?
4. ¿El consumidor lo entiende sin leer el código?
5. ¿Qué pasa cuando se abusa?

---

## El factory — unidad fundamental

Todos los componentes se construyen con `ComponentFactory`. Nunca con `forwardRef` directo ni con `PolymorphicFactory` (eliminado — unificado en `ComponentFactory`).

```ts
export const Badge = ComponentFactory<BadgeConfig>({
  componentName: "Badge",       // key en theme.components
  defaultProps: { variant: "Filled", size: "md" },
  render: function BadgeRender({ variant, size, ref, ...rest }) {
    // hooks locales y contextos van aquí
    const layout = useLayoutContext();
    return <Box ref={ref} {...rest} />;
  },
});
```

### Por qué function declaration en render

`eslint-plugin-react-hooks` detecta componentes por nombre léxico. Una arrow anónima no tiene nombre — el linter lanza falso error aunque React funcione. Nombrar la función (`function BadgeRender`) resuelve el problema y deja claro que esa función es el render del componente.

### Por qué no useHooks

`useHooks` fue evaluado y eliminado. Añadía indirección sin beneficio real: su único caso de valor (composición de factories, donde un componente hereda los hooks de otro) no está en el roadmap. Los hooks van directo en `render`.

---

## Clasificación de props

### OwnProps — lógica de componente
Props que requieren transformación, composición o efectos:
- Variantes semánticas: `variant`, `size`, `orientation`
- Booleanos que activan macros: `truncate`, `lineClamp`
- Comportamiento: `disabled`, `loading`

### SystemStyleProps — CSS directo
Props que mapean 1:1 a CSS. No se redeclaran en OwnProps.
- `color`, `bg`, `fontSize`, `padding`, `gap`, `display`...

---

## Macros — CSS estático reutilizable

Las macros son objetos CSS nombrados definidos en el tema. Se aplican via `apply="@nombre"`.

```ts
// ✓ dinámica vía CSS custom property
"@lineClamp": { WebkitLineClamp: "var(--line-clamp, 3)" }
// componente: vars={{ "--line-clamp": String(n) }}

// ✗ valor hardcodeado — no es una macro, es CSS inline
"@lineClamp": { WebkitLineClamp: 3 }
```

Reglas:
- Siempre prefijo `@`
- Estáticas — si el valor es dinámico, usa `vars` + CSS custom property
- Sin efectos secundarios entre macros
- Se definen en el tema, nunca inline en el componente

---

## Compound components — contextos tipados

Cada relación padre→hijo tiene su propio contexto tipado. No existe un contexto genérico.

```ts
// LayoutContext — contexto compartido para orientation, size, variant
export const [LayoutProvider, useLayoutContext] =
  useCreateProvider<LayoutContextValue>("Layout", {} as LayoutContextValue);

// Card.tsx — provee contexto a sus hijos
const ctx = useMemo(() => ({ orientation }), [orientation]);
<LayoutProvider value={ctx}>{children}</LayoutProvider>

// Divider.tsx — consume el contexto
render: function DividerRender({ orientation, ref, ...rest }) {
  const layout = useLayoutContext();
  const resolved = orientation ?? layout.orientation ?? "horizontal";
}
```

Reglas:
- Un archivo `*Context.ts` por relación compound
- `useMemo` en el value del Provider
- El hijo siempre tiene fallback razonable si no hay Provider
- No pasar estilos por contexto — eso es theme

---

## Sistema de tamaños

`sizes` se declara en `FactoryConfig` como union literal. Solo los componentes que lo declaran reciben la prop `size`. No existe un tipo global de sizes.

```ts
type BadgeConfig = ComponentConfig<{
  sizes: "xs" | "sm" | "md" | "lg";
  // ...
}>;
// → Badge acepta size="xs" | "sm" | "md" | "lg"

type BoxConfig = ComponentConfig<{
  // sin sizes
  // ...
}>;
// → Box no tiene prop size
```

---

## Roadmap

### Completado
- [x] Factory unificado (`ComponentFactory` + `PolymorphicFactory`)
- [x] Sistema de temas con `ThemeProvider`
- [x] `defaultProps` resueltos desde el tema o del factory
- [x] `sizes` condicional por componente
- [x] Macros (`apply`) con soporte a CSS custom properties
- [x] `mod` para data attributes semánticos
- [x] `vars` para CSS custom properties por instancia
- [x] Contextos tipados con `useCreateProvider`
- [x] `LayoutContext` compartido entre compound components
- [x] Componentes base: Box, Grid, Divider, Badge, Button, Card, Alert, Avatar, Input

### Próximo
- [ ] Variantes responsive (`variant={{ base: "Filled", md: "Subtle" }}`)
- [ ] Dark mode — intercambio de tema en runtime
- [ ] Tokens de color semánticos (success, warning, danger, info)
- [ ] Motion — tokens de animación en el tema
- [ ] `Accordion`, `Tabs`, `Modal`, `Tooltip` — compound components complejos
- [ ] Documentación con Storybook completa por componente

### Decisiones descartadas con razón
- **`useHooks`** — eliminado; hooks van directo en `render` con function declaration
- **`PolymorphicFactory`** — eliminado; unificado en `ComponentFactory`. La polimorfía (`as`) la maneja el factory internamente; el render no recibe `Component`
- **`Component` en render props** — eliminado; los renders usan `Box`/ directamente, no el elemento resuelto por `as`
- **`H` generic en factories** — TypeScript no soporta inferencia genérica parcial cuando `Config` es explícito; no hay solución limpia sin cambiar el API
- **CSS-in-JS runtime** — descartado por costo en bundle y performance; el sistema usa CSS custom properties + data attributes
- **Contexto genérico `Record<string, unknown>`** — descartado; elimina tipos y causa re-renders innecesarios
- **OwnProps con mismo nombre que StyleProps** — produce `never` en la intersección de tipos; renombrar siempre (`position` → `labelPosition`, etc.)
