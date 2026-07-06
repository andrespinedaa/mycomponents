// src/system/parse-style-props.test.ts
import { describe, it, expect } from "vitest";
import { parseStyleProps } from "./parse-style-props";
import { defaultTheme } from "../themes/default-theme";

function asVars(styles: React.CSSProperties): Record<string, unknown> {
  return styles as Record<string, unknown>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Shortcut para el tema default — lo reutilizamos en todos los tests
const theme = defaultTheme;

describe("parseStyleProps", () => {
  // ─── 1. Camino directo — valor plano, sin cambios ─────────────────────────
  describe("camino directo — valor plano", () => {
    it("retorna hasResponsive: false cuando todos los valores son planos", () => {
      const { hasResponsive } = parseStyleProps(
        { p: "md", bg: "primary.500" },
        theme,
      );
      expect(hasResponsive).toBe(false);
    });

    it("resuelve token de spacing a CSS var", () => {
      const { styles } = parseStyleProps({ p: "md" }, theme);
      expect(styles.padding).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
    });

    it("resuelve token de color a CSS var", () => {
      const { styles } = parseStyleProps({ bg: "primary.500" }, theme);
      expect(styles.background).toBe(`var(--${theme.cssVarPrefix}-color-primary-500)`);
    });

    it("resuelve token de radius a CSS var", () => {
      const { styles } = parseStyleProps({ rounded: "lg" }, theme);
      expect(styles.borderRadius).toBe(`var(--${theme.cssVarPrefix}-radius-lg)`);
    });

    it("resuelve token de fontSize a CSS var", () => {
      const { styles } = parseStyleProps({ fontSize: "xl" }, theme);
      expect(styles.fontSize).toBe(`var(--${theme.cssVarPrefix}-font-size-xl)`);
    });

    it("pasa valor raw sin transformar", () => {
      const { styles } = parseStyleProps({ display: "flex" }, theme);
      expect(styles.display).toBe("flex");
    });

    it("pasa valor arbitrario como escape hatch", () => {
      const { styles } = parseStyleProps({ p: "32px" }, theme);
      expect(styles.padding).toBe("32px");
    });

    it("resuelve mx a marginLeft y marginRight como CSS vars", () => {
      const { styles } = parseStyleProps({ mx: "md" }, theme);
      expect(styles.marginLeft).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
      expect(styles.marginRight).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
    });

    it("resuelve py a paddingTop y paddingBottom como CSS vars", () => {
      const { styles } = parseStyleProps({ py: "sm" }, theme);
      expect(styles.paddingTop).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(styles.paddingBottom).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
    });

    it("ignora valores undefined", () => {
      const { styles } = parseStyleProps({ p: undefined }, theme);
      expect(styles.padding).toBeUndefined();
    });

    it("ignora valores null", () => {
      const { styles } = parseStyleProps({ p: null as any }, theme);
      expect(styles.padding).toBeUndefined();
    });

    it("retorna objeto vacío y hasResponsive false con styleProps vacío", () => {
      const { styles, hasResponsive } = parseStyleProps({}, theme);
      expect(Object.keys(styles)).toHaveLength(0);
      expect(hasResponsive).toBe(false);
    });

    it("combina múltiples props planas correctamente", () => {
      const { styles, hasResponsive } = parseStyleProps(
        { p: "md", bg: "primary.500", rounded: "md", display: "flex" },
        theme,
      );
      expect(styles.padding).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
      expect(styles.background).toBe(`var(--${theme.cssVarPrefix}-color-primary-500)`);
      expect(styles.borderRadius).toBe(`var(--${theme.cssVarPrefix}-radius-md)`);
      expect(styles.display).toBe("flex");
      expect(hasResponsive).toBe(false);
    });
  });

  // ─── 2. Camino responsive — objeto por breakpoint ─────────────────────────
  describe("camino responsive — objeto { base, sm, md, lg, xl }", () => {
    it("retorna hasResponsive: true cuando hay objeto responsive", () => {
      const { hasResponsive } = parseStyleProps(
        { p: { base: "sm", md: "lg" } },
        theme,
      );
      expect(hasResponsive).toBe(true);
    });

    it("genera CSS var por cada breakpoint declarado", () => {
      const { styles } = parseStyleProps(
        { p: { base: "sm", md: "lg" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);
    });

    it("NO genera CSS var para breakpoints no declarados", () => {
      const { styles } = parseStyleProps(
        { p: { base: "sm", md: "lg" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--padding-sm" as any]).toBeUndefined();
      expect(vars["--padding-lg" as any]).toBeUndefined();
      expect(vars["--padding-xl" as any]).toBeUndefined();
    });

    it("genera vars para los 5 breakpoints si todos se declaran", () => {
      const { styles } = parseStyleProps(
        { p: { base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-xs)`);
      expect(vars["--padding-sm" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
      expect(vars["--padding-lg" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);
      expect(vars["--padding-xl" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-xl)`);
    });

    it("resuelve tokens del tema dentro de cada breakpoint", () => {
      const { styles } = parseStyleProps(
        { p: { base: "sm", lg: "2xl" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-lg" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-2xl)`);
    });

    it("acepta valores arbitrarios en breakpoints", () => {
      const { styles } = parseStyleProps(
        { w: { base: "100%", md: "400px" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--width-base" as any]).toBe("100%");
      expect(vars["--width-md" as any]).toBe("400px");
    });

    it("acepta números en breakpoints", () => {
      const { styles } = parseStyleProps(
        { zIndex: { base: 1, md: 10 } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--z-index-base" as any]).toBe("1");
      expect(vars["--z-index-md" as any]).toBe("10");
    });

    it("alias 'full' se resuelve a 100% dentro del objeto responsive", () => {
      const { styles } = parseStyleProps(
        { w: { base: "full", lg: "400px" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--width-base" as any]).toBe("100%");
    });

    it("alias 'auto' se resuelve dentro del objeto responsive", () => {
      const { styles } = parseStyleProps(
        { w: { base: "auto", lg: "500px" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--width-base" as any]).toBe("auto");
    });

    it("ignora breakpoints con valor undefined dentro del objeto", () => {
      const { styles } = parseStyleProps(
        { p: { base: "sm", md: undefined } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-md" as any]).toBeUndefined();
    });

    it("prop con múltiples CSS targets genera var para cada una", () => {
      // mx → marginLeft + marginRight, ambas deben tener sus vars
      const { styles } = parseStyleProps(
        { mx: { base: "sm", md: "lg" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--margin-left-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--margin-right-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--margin-left-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);
      expect(vars["--margin-right-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);
    });

    it("hasResponsive es true incluso si solo UNA prop es responsive", () => {
      const { hasResponsive } = parseStyleProps(
        { p: "md", w: { base: "full", lg: "400px" } },
        theme,
      );
      expect(hasResponsive).toBe(true);
    });
  });

  // ─── 3. Mezcla de planas y responsive en el mismo elemento ────────────────
  describe("mezcla — planas y responsive juntas", () => {
    it("las planas van directo a styles, las responsive generan vars", () => {
      const { styles, hasResponsive } = parseStyleProps(
        {
          p: { base: "sm", md: "lg" }, // responsive
          bg: "primary.500", // plana
          display: "flex", // plana
        },
        theme,
      );
      const vars = asVars(styles);

      // responsive — genera vars
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);

      // planas — valores directos
      expect(styles.background).toBe(`var(--${theme.cssVarPrefix}-color-primary-500)`);
      expect(styles.display).toBe("flex");

      // hasResponsive refleja que hubo al menos una responsive
      expect(hasResponsive).toBe(true);
    });

    it("las planas no interfieren con las responsive y viceversa", () => {
      const { styles } = parseStyleProps(
        {
          p: { base: "sm", lg: "xl" },
          rounded: "md", // plana, no responsive
        },
        theme,
      );
      const vars = asVars(styles);

      expect(styles.borderRadius).toBe(`var(--${theme.cssVarPrefix}-radius-md)`);
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--padding-lg" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-xl)`);
      // borderRadius no genera ninguna var responsive
      expect(vars["--border-radius-base" as any]).toBeUndefined();
    });
  });

  // ─── 4. Salvaguarda — prop fuera de la lista cerrada responsive ───────────
  describe("salvaguarda — prop fuera de RESPONSIVE_CSS_PROPERTIES", () => {
    it("prop responsive no elegible cae al valor de base", () => {
      // boxShadow no está en RESPONSIVE_CSS_PROPERTIES
      const { styles, hasResponsive } = parseStyleProps(
        {
          boxShadow: {
            base: "0 2px 4px rgba(0,0,0,0.1)",
            md: "0 8px 24px rgba(0,0,0,0.2)",
          },
        } as any,
        theme,
      );
      const vars = asVars(styles);

      // cae al valor de base — no pierde el valor completamente
      expect(styles.boxShadow).toBe("0 2px 4px rgba(0,0,0,0.1)");

      // NO genera vars (no hay @media que las lea)
      expect(vars["--box-shadow-base" as any]).toBeUndefined();

      // NO activa hasResponsive — no paga el costo del selector
      expect(hasResponsive).toBe(false);
    });

    it("prop no elegible descarta breakpoints distintos de base", () => {
      const { styles } = parseStyleProps(
        {
          boxShadow: { base: "0 2px 4px black", lg: "0 8px 24px black" },
        } as any,
        theme,
      );
      // solo base — lg se descarta silenciosamente
      expect(styles.boxShadow).toBe("0 2px 4px black");
    });

    it("prop no elegible sin base no genera ningún valor", () => {
      const { styles } = parseStyleProps(
        { boxShadow: { md: "0 8px 24px black" } } as any,
        theme,
      );
      // md no es base, se descarta — sin valor
      expect(styles.boxShadow).toBeUndefined();
    });
  });

  // ─── 5. Edge cases ────────────────────────────────────────────────────────
  describe("edge cases", () => {
    it("objeto responsive vacío no genera nada y hasResponsive es false", () => {
      const { styles, hasResponsive } = parseStyleProps(
        { p: {} as any },
        theme,
      );
      const vars = asVars(styles);
      expect(styles.padding).toBeUndefined();
      expect(vars["--padding-base" as any]).toBeUndefined();
      expect(hasResponsive).toBe(false);
    });

    it("prop desconocida en STYLE_PROPS_DATA se ignora silenciosamente", () => {
      const { styles } = parseStyleProps(
        { unknownProp: "value" } as any,
        theme,
      );
      expect(Object.keys(styles)).toHaveLength(0);
    });

    it("solo base en objeto responsive sigue siendo responsive", () => {
      const { styles, hasResponsive } = parseStyleProps(
        { p: { base: "md" } },
        theme,
      );
      const vars = asVars(styles);
      // genera var --padding-base, no el valor directo
      expect(vars["--padding-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-md)`);
      expect(styles.padding).toBeUndefined(); // no el valor plano
      expect(hasResponsive).toBe(true);
    });

    it("opacity responsive acepta números", () => {
      const { styles, hasResponsive } = parseStyleProps(
        { opacity: { base: 1, md: 0.5 } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--opacity-base" as any]).toBe("1");
      expect(vars["--opacity-md" as any]).toBe("0.5");
      expect(hasResponsive).toBe(true);
    });

    it("zIndex responsive acepta números", () => {
      const { styles } = parseStyleProps(
        { zIndex: { base: 1, lg: 100 } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--z-index-base" as any]).toBe("1");
      expect(vars["--z-index-lg" as any]).toBe("100");
    });

    it("fontSize responsive resuelve tokens del tema", () => {
      const { styles } = parseStyleProps(
        { fontSize: { base: "sm", lg: "2xl" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--font-size-base" as any]).toBe(`var(--${theme.cssVarPrefix}-font-size-sm)`);
      expect(vars["--font-size-lg" as any]).toBe(`var(--${theme.cssVarPrefix}-font-size-2xl)`);
    });

    it("gap responsive con tokens del tema", () => {
      const { styles } = parseStyleProps(
        { gap: { base: "sm", md: "lg", xl: "2xl" } },
        theme,
      );
      const vars = asVars(styles);
      expect(vars["--gap-base" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-sm)`);
      expect(vars["--gap-md" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-lg)`);
      expect(vars["--gap-xl" as any]).toBe(`var(--${theme.cssVarPrefix}-spacing-2xl)`);
    });
  });
});
