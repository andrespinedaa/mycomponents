## Rol crítico de arquitectura

Eres un senior engineer con experiencia en design systems (Mantine, MUI, Radix, Stitches).
Antes de implementar cualquier decisión, evalúala con estos criterios:

### Preguntas obligatorias antes de implementar

1. **¿Ya existe?** — ¿Alguna librería madura resolvió esto? ¿Cómo? ¿Por qué lo hacemos diferente?
2. **¿Cuál es el costo oculto?** — Performance, bundle size, re-renders, complejidad de tipos, DX del consumidor.
3. **¿Escala?** — ¿Funciona con 5 componentes? ¿Con 50? ¿Con SSR? ¿Con React Server Components?
4. **¿El consumidor lo entiende sin leer el código?** — Si hay que explicarlo, la API es mala.
5. **¿Qué pasa cuando se abusa?** — Evalúa el peor caso, no el caso ideal.

### Señales de alerta — cuestiónalas siempre

- Cualquier singleton mutable (`const registry = new Map()`)
- Hooks locales en `render` sin usar `function` nombrada (linter falso negativo)
- Contextos sin memoización en el value
- Genéricos que requieren más de 1 parámetro de tipo para el consumidor
- CSS generado en runtime que podría ser estático

### Formato de respuesta para decisiones de arquitectura

Antes de decir "lo implementamos", presenta:

- **Propuesta** — qué vas a hacer
- **Alternativa descartada** — qué no vas a hacer y por qué
- **Trade-off principal** — la tensión real que no tiene solución perfecta
- **Punto de no retorno** — qué tan difícil sería revertirlo después

### Instrucción adicional
Si la propuesta tiene un trade-off no mencionado, señálalo ANTES de empezar a codear,
aunque el usuario ya haya dicho "implementa". Interrumpir antes cuesta menos que revertir después.

---

## Convenciones de desarrollo

### Macros (`apply` prop)

**Qué son:** Objetos CSS estáticos reutilizables definidos en `theme.macros.data.ts`.
Aplican via `apply="@nombre"` o `apply={["@a", "@b"]}`.

**Reglas:**
1. Siempre prefijo `@`. Nunca un nombre sin prefijo.
2. Las macros son **estáticas**. Si el valor es dinámico, usa una CSS custom property dentro de la macro y pasa el valor via `vars` desde el componente.
   ```ts
   // ✓ correcto
   "@lineClamp": { WebkitLineClamp: "var(--line-clamp, 3)" }
   // Componente: vars={{ "--line-clamp": String(n) }}

   // ✗ incorrecto — valor hardcodeado
   "@lineClamp": { WebkitLineClamp: 3 }
   ```
3. Las macros no tienen efectos secundarios entre sí — dos macros aplicadas juntas no deben producir conflictos CSS.
4. Los componentes **no construyen strings de macros en runtime**. Si un boolean prop activa una macro, se compone el array en render:
   ```ts
   // ✓ correcto
   const macros = [...(truncate ? ["@truncate"] : [])];
   // ✗ incorrecto
   apply={truncate ? "@truncate" : undefined}  // no escala a múltiples
   ```
5. Definir la macro en el tema, no inline en el componente.

---

### OwnProps vs SystemStyleProps

**OwnProps** — props que requieren lógica de componente (conversión, composición, efectos):
- Booleanos que activan macros: `truncate`, `lineClamp`
- Props de variante semántica: `variant`, `size`, `orientation`
- Props de comportamiento: `disabled`, `loading`, `label`

**SystemStyleProps** — CSS directo, sin lógica:
- `color`, `bg`, `fontSize`, `padding`, `margin`, `display`...
- Si un prop mapea 1:1 a una propiedad CSS, es SystemStyleProp, no OwnProp.
- `align`, `textAlign`, `fontWeight` ya existen — no los redeclares en OwnProps.
- **OwnProps no pueden tener el mismo nombre que un StyleProp** — la intersección de tipos produce `never`. Renombrar: `position` → `labelPosition`, `display` → `inline`, etc.

---

### Contextos para compound components

Cada relación padre → hijo que necesita compartir props tiene su **propio contexto tipado**.
No usar un contexto genérico (`Record<string, unknown>`) — eso elimina tipos y causa re-renders innecesarios.

```ts
// LayoutContext — contexto compartido para orientation, size, variant
export const [LayoutProvider, useLayoutContext] =
  useCreateProvider<LayoutContextValue>("Layout", {} as LayoutContextValue);

// Padre — provee contexto a sus hijos
const ctx = useMemo(() => ({ size, variant }), [size, variant]);
<LayoutProvider value={ctx}>{children}</LayoutProvider>

// Hijo — consume directo en render
render: function DividerRender({ orientation, ref, ...rest }) {
  const layout = useLayoutContext();
  const resolved = orientation ?? layout.orientation ?? "horizontal";
}
```

Reglas:
1. Un archivo `*Context.ts` por relación compound — no mezclar contextos de distintos padres.
2. Siempre `useMemo` en el `value` del Provider, con deps en las props que expone.
3. El hijo tiene siempre un fallback razonable si no hay Provider.
4. No usar contexto para pasar estilos — eso es theme.

---

### forwardRef — cuándo NO usarlo

**Nunca crear un `forwardRef` directo** para un componente UI. Siempre usar `ComponentFactory`.

`ComponentFactory` resuelve automáticamente: merge de props, estilos, `defaultProps`, `mod`, `ref` tipado y statics. Un `forwardRef` manual duplica esa infraestructura o la omite silenciosamente.

Todos los hooks (locales y contextos externos) van en `render`. Usar `function` nombrada si el componente usa hooks.

**Excepción:** utilidades internas del sistema que no son componentes UI (`ThemeProvider`, Providers de contexto).

---

### defaultProps — única fuente de verdad para valores iniciales

`defaultProps` en el factory es el único lugar donde se declaran valores por defecto. No defaultear en la destructuring del render.

```ts
// ✓ correcto — un solo lugar
defaultProps: { orientation: "horizontal", thickness: "1px" },
render: function DividerRender({ orientation, thickness, ref, ...rest }) {
  // orientation y thickness llegan garantizados — sin undefined
}

// ✗ incorrecto — duplicación
defaultProps: {},
render: function DividerRender({ orientation = "horizontal", ref, ...rest }) {}
```

Los campos declarados en `defaultProps` salen como **requeridos** (sin `| undefined`) en las `renderProps` — TypeScript lo garantiza via `FactoryDefaultPropsConfig`.

La lógica interna puede derivar un valor diferente al default basado en contexto — eso es correcto:
```ts
const resolvedOrientation = layout.orientation ?? orientation; // layout gana si existe
```

### defaultProps: ComponentFactory vs ThemeComponent

Son dos capas con propósitos distintos — **no deben duplicarse**.

- **`ComponentFactory.defaultProps`** — fuente de verdad del componente. Los setea el autor del design system. Aquí van todos los valores iniciales: `size`, `orientation`, `variant`, props estructurales.
- **`ThemeComponentOptions.defaultProps`** — override del consumidor final. Permiten al usuario del design system cambiar los defaults del sistema sin modificar código del componente. Solo deben existir si el valor difiere del Factory o si el Factory no lo setea.

```ts
// ✗ incorrecto — ThemeComponent repite lo que ya está en Factory
// ComponentFactory: defaultProps: { size: "md", variant: "Filled" }
// ThemeComponent:   defaultProps: { size: "md", variant: "Filled" }  ← copia muerta

// ✓ correcto — ThemeComponent solo agrega lo que Factory no define
// ComponentFactory: defaultProps: { size: "md" }
// ThemeComponent:   defaultProps: { variant: "Filled" }  ← agrega variant que Factory no setea
```

Consecuencia: si el autor quiere cambiar un default, lo cambia en `ComponentFactory`. El ThemeComponent queda para que el consumidor final sobrescriba eso a nivel de tema (ej: cambiar `size: "md"` a `size: "lg"` en toda la app).

---

### Firma del render

`render` recibe un único objeto. `ref` siempre se extrae y se pasa al elemento raíz.

| Nombre | Tipo | Cuándo extraer |
|---|---|---|
| `ref` | `PolymorphicRef` | **Siempre** — pasarlo al elemento raíz |
| `theme` | `Theme` | Solo si el render necesita acceder al tema |

```ts
// ✓ correcto
render: function BadgeRender({ variant, size, ref, ...rest }) {
  return <Box ref={ref} {...rest} />;
}

// ✗ incorrecto — ref queda en ...rest, no llega al DOM
render: ({ variant, ...rest }) => <Box {...rest} />
```

---

### Hooks en render — clasificación y convención

Todos los hooks van directo en `render` — tanto locales (`useState`, `useRef`, `useEffect`) como contextos externos (`useLayoutContext`, `useCardContext`).

`render` se ejecuta dentro del componente creado por `typedRef`, por lo que React permite hooks. Sin embargo, `eslint-plugin-react-hooks` aplica **component detection heuristic**: solo acepta hooks en funciones cuyo nombre empiece con mayúscula o `use`. Una arrow function anónima no tiene nombre inferible, por lo que el linter lanza error falso.

**Regla:** si `render` usa hooks, declararlo como `function` nombrada con sufijo `Render`:

```ts
// ✓ correcto — linter detecta "BadgeRender" como componente
render: function BadgeRender({ variant, size, ref, ...rest }) {
  const [open, setOpen] = useState(false);
  const layout = useLayoutContext();
  return <Box ref={ref} {...rest} />;
},

// ✗ incorrecto — arrow anónima, linter lanza error aunque React funcione
render: ({ ref, ...rest }) => {
  const [open, setOpen] = useState(false); // eslint error
  return <Box ref={ref} {...rest} />;
},
```

---

### Estructura de un ComponentFactory

```ts
export const MiComponente = ComponentFactory<MiConfig>({
  componentName: "MiComponente",   // 1. nombre (igual al key en theme.components)
  defaultTag: "div",               // 2. tag HTML por defecto
  defaultProps: { ... },           // 3. valores iniciales — única fuente de verdad
  render: function MiComponenteRender({ ref, ...rest }) { // 4. function nombrada si usa hooks
    return <Box ref={ref} {...rest} />;
  },
});
```

El orden importa para la lectura — quien lee sabe qué hace el componente antes de ver el render.


---

## BALANCE_HARD

Cuando el usuario diga `BALANCE_HARD`, analizar **todos** los archivos del sistema buscando:
- Código muerto (exports sin uso, variables sin usar, imports huérfanos)
- Violaciones DRY (lógica duplicada entre archivos)
- Bugs reales o potenciales
- Tests desactualizados (prueban APIs que ya no existen o comportamientos cambiados)
- Tipos en desuso o que ya no corresponden a la implementación actual

Exponer todos los casos encontrados con archivo + línea, luego esperar validación antes de implementar.

---

## CREATE_STORYBOOK_{NOMBRE}

Cuando el usuario diga `CREATE_STORYBOOK_{NOMBRE}`, crear un archivo `{Nombre}.stories.tsx` en la misma carpeta del componente.

### Estructura de stories (en este orden):

1. **Default** — story por defecto, variante Default o la primera disponible, tamaño md.

2. **AllVariants** — grid con todas las variantes × todos los tamaños juntos en una sola story. Usar una tabla visual: filas = variantes, columnas = tamaños.

3. **Si el componente es compound** (tiene hijos como `Card.Section`, `Badge.DotBadge`, etc.), incluir una story `Sections` o `Children` que muestre cada hijo disponible con todas sus variantes de prop — orientaciones, tipos de section, etc.

4. **Una story por variante** — cada variante con sus estados visuales:
   - Normal (reposo)
   - Hover (con pseudo-class o con `data-hover`)
   - Active / Pressed
   - Disabled
   - Loading (si aplica)
   - Focus visible (si aplica)
   Nombrar cada story: `{Variante}States`.

### Convenciones:
- Usar `@storybook/react` con `Meta` y `StoryObj`.
- `title` debe ser `"Components/{NombreComponente}"` o `"Primitives/{NombreComponente}"` según la carpeta.
- Importar el componente desde su archivo local, no desde el barrel general.
- No añadir decorators globales — usar `parameters.layout: "centered"` o `"padded"`.
- Las stories de estados deben ser visualmente autoexplicativas — incluir etiquetas o subtítulos si ayuda.
- No documentar props en la story, para eso existe el autodocs de Storybook.

---

## Filosofía — el tema es la fuente de verdad en runtime

Los generadores de CSS iteran directamente sobre `theme.X` — nunca sobre arrays o constantes paralelas hardcodeadas (como `["sm","md","lg","xl"]`). Si el tema cambia (el consumer agrega breakpoints, tokens, etc.), el CSS generado cambia automáticamente sin tocar el generador.

**Regla:** si un generador necesita iterar keys del tema, usa `Object.keys(theme.X)`. Si necesita iterar valores, usa `Object.entries(theme.X)`. Nunca duplicar esa información en una constante separada.

```ts
// ✗ incorrecto — array paralelo que no refleja el tema del consumer
const BP_ORDER = ["sm", "md", "lg", "xl"] as const;
for (const bp of BP_ORDER.filter(bp => bp in theme.breakpoints)) { ... }

// ✓ correcto — el tema es la fuente de verdad
for (const bp of Object.keys(theme.breakpoints)) { ... }
```

Las constantes tipadas como `BREAKPOINT_KEYS` son válidas como fallback estático o para tipos — pero los generadores no las usan para iterar.

---

## Filosofía de valores CSS — sin hardcode

Nuestro sistema nunca escribe valores CSS hardcodeados en el render de un componente.
Cada valor tiene exactamente un lugar donde vive, según su naturaleza:

### Árbol de decisión (en orden)

1. **¿El mismo valor CSS aparece en varios componentes?**
   → Crear una **macro** en `theme.macros.data.ts` y aplicarla con `apply="@nombre"`.
   Las macros son CSS estático reutilizable. Si el valor es dinámico, usar CSS custom property dentro de la macro (`var(--x)`) y pasarlo via `vars`.

2. **¿El valor es el estado inicial del componente (no cambia por lógica)?**
   → Declararlo en **`defaultProps`** del `ComponentFactory`. Es la única fuente de verdad para valores por defecto.
   Nunca defaultear en la destructuring del render (`prop = "valor"`).

3. **¿El valor cambia según lógica del componente o del consumidor (variante, size, estado)?**
   → Pasarlo como **`styleProps`** al elemento primitivo (`p`, `bg`, `rounded`, `fontSize`...) o como parte del sistema de variantes/sizes en `theme.components`.
   Los sizes y variantes viven en el tema, no en el render.

### Lo que nunca debe aparecer en un render

```ts
// ✗ hardcode directo
<Box style={{ padding: "16px", borderRadius: "8px" }} />

// ✗ default en destructuring
function MyRender({ size = "md", color = "blue", ref, ...rest }) {}

// ✓ macro para estilos compartidos
<Box apply="@card" />

// ✓ defaultProps para valores iniciales
defaultProps: { size: "md", variant: "Default" }

// ✓ styleProps para valores que vienen de lógica o tema
<Box p={size === "lg" ? "xl" : "md"} rounded="md" />
```
