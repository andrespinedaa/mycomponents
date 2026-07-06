import { describe, it, expect } from "vitest";
import { resolveStyle } from "./resolve-styles";
import { defaultTheme } from "../themes/default-theme";

const theme = defaultTheme;
const prefix = theme.cssVarPrefix;

describe("resolveStyle", () => {

  // ─── casos vacíos / falsy ─────────────────────────────────────────────────
  describe("sin valor", () => {
    it("retorna undefined si style es undefined", () => {
      expect(resolveStyle(undefined, theme)).toBeUndefined();
    });

    it("retorna undefined si style es objeto vacío", () => {
      expect(resolveStyle({}, theme)).toBeUndefined();
    });

    it("retorna undefined si la función devuelve objeto vacío", () => {
      expect(resolveStyle(() => ({}), theme)).toBeUndefined();
    });

    it("ignora propiedades con valor null", () => {
      expect(resolveStyle({ color: null as any }, theme)).toBeUndefined();
    });
  });

  // ─── forma objeto ─────────────────────────────────────────────────────────
  describe("objeto directo", () => {
    it("pasa valores CSS sin token sin modificar", () => {
      const result = resolveStyle({ cursor: "pointer", display: "flex" }, theme);
      expect(result).toEqual({ cursor: "pointer", display: "flex" });
    });

    it("resuelve token de spacing — padding: 'md'", () => {
      const result = resolveStyle({ padding: "md" }, theme);
      expect(result).toEqual({ padding: `var(--${prefix}-spacing-md)` });
    });

    it("resuelve token de color — color: 'primary.500'", () => {
      const result = resolveStyle({ color: "primary.500" }, theme);
      expect(result).toEqual({ color: `var(--${prefix}-color-primary-500)` });
    });

    it("resuelve token de radius — borderRadius: 'md'", () => {
      const result = resolveStyle({ borderRadius: "md" }, theme);
      expect(result).toEqual({ borderRadius: `var(--${prefix}-radius-md)` });
    });

    it("resuelve token de fontSize — fontSize: 'sm'", () => {
      const result = resolveStyle({ fontSize: "sm" }, theme);
      expect(result).toEqual({ fontSize: `var(--${prefix}-font-size-sm)` });
    });

    it("resuelve alias de spacing — 'auto' → 'auto'", () => {
      const result = resolveStyle({ padding: "auto" }, theme);
      expect(result).toEqual({ padding: "auto" });
    });

    it("pasa valor CSS arbitrario sin modificar si no coincide con token", () => {
      const result = resolveStyle({ padding: "8px" }, theme);
      expect(result).toEqual({ padding: "8px" });
    });

    it("resuelve mezcla de props con y sin token", () => {
      const result = resolveStyle({ padding: "md", cursor: "pointer", color: "primary.500" }, theme);
      expect(result).toEqual({
        padding: `var(--${prefix}-spacing-md)`,
        cursor: "pointer",
        color: `var(--${prefix}-color-primary-500)`,
      });
    });
  });

  // ─── forma función ────────────────────────────────────────────────────────
  describe("función con tema", () => {
    it("llama la función con el tema y resuelve el resultado", () => {
      const result = resolveStyle((t) => ({ padding: t.spacing.md }), theme);
      expect(result).toEqual({ padding: theme.spacing.md });
    });

    it("función puede devolver tokens — se resuelven igual que el objeto", () => {
      const result = resolveStyle((_t) => ({ color: "primary.500" }), theme);
      expect(result).toEqual({ color: `var(--${prefix}-color-primary-500)` });
    });

    it("función que devuelve vacío → undefined", () => {
      const result = resolveStyle((_t) => ({}), theme);
      expect(result).toBeUndefined();
    });
  });

  // ─── props de categoría raw ───────────────────────────────────────────────
  describe("categoría raw — sin resolución de token", () => {
    it("flexDirection pasa sin modificar", () => {
      const result = resolveStyle({ flexDirection: "row" }, theme);
      expect(result).toEqual({ flexDirection: "row" });
    });

    it("opacity — number se convierte a string por resolveValue", () => {
      const result = resolveStyle({ opacity: 0.5 }, theme);
      expect(result).toEqual({ opacity: "0.5" });
    });
  });

});
