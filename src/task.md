Tomo el control de la lista entonces. Vamos a construirla con criterio profesional — clasificando cada propiedad CSS por el tipo de valor que acepta, porque eso determina tanto el tipo TypeScript como cómo se resuelve en resolveValue.

Clasificación de propiedades responsive-eligibles:Voy a presentarte la clasificación profesional directamente en texto, organizada por cómo cada propiedad necesita resolverse en el sistema:

Clasificación de propiedades CSS responsive-eligibles, por tipo de valor:
Grupo 1 — number | string (necesitan unidad, aceptan token o número crudo):
width, height, minWidth, maxWidth, minHeight, maxHeight
padding, paddingTop, paddingRight, paddingBottom, paddingLeft
margin, marginTop, marginRight, marginBottom, marginLeft
gap, rowGap, columnGap
top, right, bottom, left, inset
fontSize

Estas ya pasan por resolveValue con categoría spacing o fontSize — un número se interpreta como px implícito o se castea a string, y un string puede ser un token ("md") o un valor arbitrario ("32px", "2rem").
Grupo 2 — string puro, valores de palabra clave CSS (no llevan unidad, no son tokens del tema):
display
flexDirection, flexWrap
alignItems, justifyContent, alignContent, justifyItems, placeItems, placeContent
gridAutoFlow
position
textAlign
Estas van con categoría raw — el valor pasa directo sin transformación.
Grupo 3 — number puro (sin unidad, valores escalares):
flexGrow, flexShrink
zIndex
opacity
Grupo 4 — string libre, sintaxis CSS compleja (no son enumerables, no tiene sentido tokenizar):
gridTemplateColumns, gridTemplateRows, gridTemplateAreas
gridColumn, gridRow, gridArea
gridAutoColumns, gridAutoRows

El tipo Responsive<T> que comparten todas — ya está bien diseñado, solo falta aplicarlo consistentemente:
typescript// system/responsive.types.ts
export const BREAKPOINT_KEYS = ["base", "sm", "md", "lg", "xl"] as const;
export type BreakpointKey = typeof BREAKPOINT_KEYS[number];

export type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

export function isResponsiveObject<T>(
  value: Responsive<T> | undefined,
): value is Partial<Record<BreakpointKey, T>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
Y cómo queda cada grupo en StyleProps:
typescript// Grupo 1 — number | string con resolución de tokens
type SpacingResponsive = Responsive<SpacingValue | number>;

w?: SpacingResponsive;
h?: SpacingResponsive;
p?: SpacingResponsive;
gap?: SpacingResponsive;
fontSize?: Responsive<FontSizeValue | number>;

// Grupo 2 — string puro, sin number
display?: Responsive<DisplayValue>;
align?: Responsive<AlignValue>;
justify?: Responsive<JustifyValue>;

// Grupo 3 — number puro
zIndex?: Responsive<number>;
opacity?: Responsive<number>;
flexGrow?: Responsive<number>;

// Grupo 4 — string libre
gridTemplateColumns?: Responsive<string>;
gridColumn?: Responsive<string>;

Ahora sí, generamos el archivo responsive.css cubriendo el Grupo 1 + Grupo 3 (que son los que tienen sentido absoluto en un layout responsive — Grupo 2 y 4 casi nunca cambian por breakpoint en la práctica, y si lo necesitás puntualmente lo resolvemos con style inline + JS, no vale la pena meterlos en el CSS global):Ejecutó 2 comandos, archivo creadoEjecutó 2 comandos, archivo creadoEl CSS se generó correctamente — 172 líneas, 29 propiedades, 5 bloques (base + 4 media queries), cada uno con fallback en cascada hacia el breakpoint anterior. Hay un detalle importante que encontré al revisar el output: usé revert como fallback final en el bloque base, pero eso solo es seguro si el elemento no tiene ya un valor de esa propiedad en su style inline directo — vamos a corregirlo, porque interactúa mal con tu resolvedStyles actual.Presented 2 filesPresented 2 filesEl problema con revert que detecté: si el elemento tiene style.padding = "8px" puesto por resolvedStyles (el camino no-responsive actual), y además tiene data-responsive con --padding-base sin definir, revert en el bloque [data-responsive] haría que el padding vuelva al valor del navegador, no al style inline. Eso rompería el caso donde solo algunas props son responsive y otras no, en el mismo elemento. La corrección: el bloque base usa var(--padding-base, unset) en vez de revert, así si la var no está definida, no toca la propiedad en absoluto y el style inline directo sigue mandando.2 archivos editados, ejecutó un comando2 archivos editados, ejecutó un comandoCorregido. Ahora el wiring TypeScript — la parte que detecta el objeto responsive en parseStyleProps y genera las CSS vars:Se crearon 2 archivosSe crearon 2 archivosAhora resolvedStyles necesita propagar hasResponsive hacia afuera, y PolymorphicFactory necesita agregar el atributo data-responsive condicionalmente:Archivo creado, leyó un archivoArchivo creado, leyó un archivoTe dejo los 5 archivos. Falta el último paso — cómo se conecta esto en PolymorphicFactory, que ya no llama getStyle() esperando CSSProperties | undefined directo, sino { styles, hasResponsive }:
tsx// PolymorphicFactory.tsx — cambio en getStyle y en el render
const getStyle = (extraStyle?: CSSProperties) =>
  resolvedStyles({
    styleProps, vars, style, theme, extraStyle, unstyled, apply,
  });

// en el JSX
const { styles, hasResponsive } = getStyle();

return (
  <Component
    ref={ref}
    className={className}
    style={styles}
    data-responsive={hasResponsive ? "" : undefined} // ← solo si aplica
    {...componentProps}
  />
);
Y el responsive.css generado se importa una sola vez en tu entry point (src/index.ts o donde tengas el ThemeProvider raíz) — nunca se vuelve a tocar a mano, solo se regenera corriendo el script si agregás una propiedad nueva a la lista cerrada.
¿Hacemos ahora el ajuste en PolymorphicFactory.tsx con este nuevo contrato de resolvedStyles, y escribimos los tests de parseStyleProps para el camino responsive?