# Design Brief — MyComponents Design System
## Prompt para Claude Design

---

## Contexto del proyecto

MyComponents es una librería de componentes React con un sistema de tokens CSS basado en custom properties con el prefijo `--mycomponents-`. Los tokens se inyectan en `:root` y los componentes los consumen via variables propias. El sistema soporta dark/light mode via `data-color-scheme` en el elemento raíz.

**Componentes existentes:** Button, Badge, Alert, Avatar, Input, Card (+ Header, Body, Footer, Section, Image), Divider, Text, Box, Flex, Grid.

**Variables de tema que ya existen en código:**
- Escala de colores: primary, secondary, neutral, success, warning, danger, info (matices 50→950)
- Escala de espaciado: xs, sm, md, lg, xl, 2xl
- Escala de tipografía: xs, sm, md, lg, xl, 2xl, 3xl
- Escala de radios: none, sm, md, lg, full
- Breakpoints: sm, md, lg, xl

---

## Tarea

Crear **3 propuestas de diseño completas** para la librería. Cada propuesta es un sistema visual coherente — no una colección de estilos independientes. Cambiar una parte cambia todo.

---

## Requisitos de cada propuesta

### Identidad visual
Define el carácter con una frase. No "moderno y limpio" — algo específico: "vidrio esmerilado sobre negro profundo", "papel japonés digital", "terminal que aprendió a sonreír".

### Paleta de colores
Para cada color semántico (primary, secondary, neutral, success, warning, danger, info):
- Escala completa de 11 matices: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Valor hexadecimal exacto para cada matiz
- Ratio de contraste del matiz 500 vs blanco y vs negro

### Tokens semánticos de UI
Define el valor de cada token en light mode y dark mode:
```
background, surface, surface-raised
border, border-strong
text, text-subtle, text-disabled
```
Indicar sobre qué matiz de la escala mapea cada token en cada modo.

### Tipografía
- Font family principal y fallback stack
- Uso de cada tamaño de la escala (xs → 3xl): qué rol cumple, valor en rem
- Pesos usados: cuáles, cuándo
- Line height por tamaño
- Letter spacing si aplica

### Espaciado
Valor absoluto en px y rem para cada paso de la escala: xs, sm, md, lg, xl, 2xl.

### Radios
Valor absoluto en px para cada paso: none, sm, md, lg, full.

### Sombras
Define 4 niveles (sm, md, lg, xl) para light mode y dark mode.
Las sombras en dark mode no son iguales a las de light — son más sutiles o usan color en lugar de negro.
Formato: `box-shadow` value completo.

### Transiciones
Define las variables de timing:
- `--mycomponents-duration-fast`: para micro-interacciones (hover, focus)
- `--mycomponents-duration-base`: para cambios de estado
- `--mycomponents-duration-slow`: para animaciones de layout
- `--mycomponents-ease-default`: easing estándar
- `--mycomponents-ease-in`: para salidas
- `--mycomponents-ease-out`: para entradas

### Por cada componente (Button, Badge, Alert, Avatar, Input, Card, Divider, Text)

**Variables CSS del componente** — todas las propiedades visuales como variables que referencian los tokens del sistema. Ejemplo:
```css
--mycomponents-btn-background: var(--mycomponents-color-primary-500);
--mycomponents-btn-background-hover: var(--mycomponents-color-primary-600);
--mycomponents-btn-color: #ffffff;
--mycomponents-btn-radius: var(--mycomponents-radius-md);
--mycomponents-btn-shadow: var(--mycomponents-shadow-sm);
--mycomponents-btn-shadow-hover: var(--mycomponents-shadow-md);
--mycomponents-btn-transition: background var(--mycomponents-duration-fast) var(--mycomponents-ease-default),
                               box-shadow var(--mycomponents-duration-fast) var(--mycomponents-ease-default),
                               transform var(--mycomponents-duration-fast) var(--mycomponents-ease-default);
```

**Variantes** — cómo cambian las variables por variante (Filled, Outlined, etc.)

**Estados** — cómo cambian las variables por estado (hover, focus, active, disabled). El estado focus SIEMPRE debe ser visible y no puede ser solo un cambio de color.

**Tamaños** (donde aplica) — valores de padding, font-size, height por tamaño sm/md/lg.

**Mockup HTML** — renderiza el componente con todas sus variantes y estados visibles simultáneamente. Usar solo CSS inline o `<style>` en el mismo bloque. Usar `system-ui` o `Inter` como fuente. El mockup debe ser fiel a la propuesta — no un placeholder genérico.

---

## Las 3 propuestas de estilo

### Propuesta 1 — "Mineral"
Inspiración: Apple Vision Pro UI, glassmorphism sobrio, SF Pro feel.
Características esperadas: superficies translúcidas o con profundidad sutil, radios grandes (12px–16px dominantes), sombras difusas de color (no negras), tipografía ligera con mucho espacio, paleta casi monocromática con un acento vibrante pero contenido, dark mode con fondos muy oscuros casi negros (#09090b), transiciones suaves y precisas.
Evitar: exceso de blur, efectos neon, colores saturados en superficies grandes.

### Propuesta 2 — "Meridian"
Inspiración: Linear, Vercel Dashboard, Raycast — productividad sin fricción.
Características esperadas: alta densidad de información sin sentirse apretado, radios medios (6px–8px), sombras casi inexistentes reemplazadas por bordes sutiles, tipografía geométrica con jerarquía clara, dark mode con fondos zinc (#18181b), paleta de acento con azul o violeta desaturado, interacciones rápidas (100ms–150ms), sensación de velocidad.
Evitar: decoración innecesaria, sombras dramáticas, colores pastel.

### Propuesta 3 — "Canvas"
Inspiración: Notion, Craft, apps de creativos — cálido y orgánico.
Características esperadas: radios medianos pero consistentes (8px–10px), paleta warm neutral (slate con tinte cálido, no gray frío), tipografía legible con línea de base generosa, sombras suaves en warm tone (no negro puro), dark mode en tonos de carbón caliente (#1c1917), acento en ámbar/terracota o verde sage, transiciones con ease-out elástico sutil, sensación de papel físico digitalizado.
Evitar: frialdad, alta saturación, densidad extrema.

---

## Tabla comparativa al finalizar

Incluir al final de las 3 propuestas una tabla con:

| | Mineral | Meridian | Canvas |
|---|---|---|---|
| Personalidad | | | |
| Radio dominante | | | |
| Densidad | | | |
| Mejor para | | | |
| Dark mode feel | | | |
| Referencia más cercana | | | |

---

## Reglas del proceso

1. Presentar las 3 propuestas en orden. No mezclar elementos entre propuestas.
2. Cada propuesta es autocontenida — puede implementarse sola sin depender de las otras.
3. Cuando se pida una actualización puntual ("cambia el radio de Button en Mineral"), modificar solo ese componente de esa propuesta y verificar que sea coherente con el resto del sistema de esa propuesta.
4. Si una actualización rompe coherencia interna (ej: cambiar el radio de Button a 2px cuando el Card tiene 16px), señalarlo antes de implementar.
5. Los valores de tokens deben ser implementables directamente en el `defaultTheme` del sistema — no valores que requieran cambios de arquitectura.
6. Accesibilidad no es opcional: todo texto sobre fondo coloreado debe cumplir WCAG AA mínimo.
