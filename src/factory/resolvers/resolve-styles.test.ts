import { describe, it, expect } from "vitest";
import { resolveStyle } from "./resolve-styles";
import { defaultTheme } from "../../theme/themes/default-theme";
import { generateTokens } from "../../system/generators/generateTokens";

const theme = defaultTheme;
const prefix = theme.prefix;
const { vars: tokenVars } = generateTokens(defaultTheme);

describe("resolveStyle", () => {
  // ─── casos vacíos / falsy ─────────────────────────────────────────────────
  describe("sin valor", () => {
    it("retorna undefined si style es undefined", () => {
      expect(resolveStyle(theme, undefined, tokenVars)).toBeUndefined();
    });

    it("retorna undefined si style es objeto vacío", () => {
      expect(resolveStyle(theme, {}, tokenVars)).toBeUndefined();
    });

    it("retorna undefined si la función devuelve objeto vacío", () => {
      expect(resolveStyle(theme, () => ({}), tokenVars)).toBeUndefined();
    });

    it("ignora propiedades con valor null", () => {
      expect(resolveStyle(theme, { color: null as any }, tokenVars)).toBeUndefined();
    });
  });

  // ─── forma objeto ─────────────────────────────────────────────────────────
  describe("objeto directo", () => {
    it("pasa valores CSS sin token sin modificar", () => {
      const result = resolveStyle(theme, { cursor: "pointer", display: "flex" }, tokenVars);
      expect(result).toEqual({ cursor: "pointer", display: "flex" });
    });

    it("resuelve token de spacing — padding: 'md'", () => {
      const result = resolveStyle(theme, { padding: "md" }, tokenVars);
      expect(result).toEqual({ padding: `var(--${prefix}-spacing-md)` });
    });

    it("resuelve token de color — color: 'primary.500'", () => {
      const result = resolveStyle(theme, { color: "primary.500" }, tokenVars);
      expect(result).toEqual({ color: `var(--${prefix}-colors-primary-500)` });
    });

    it("resuelve token de radius — borderRadius: 'md'", () => {
      const result = resolveStyle(theme, { borderRadius: "md" }, tokenVars);
      expect(result).toEqual({ borderRadius: `var(--${prefix}-radius-md)` });
    });

    it("resuelve token de fontSize — fontSize: 'sm'", () => {
      const result = resolveStyle(theme, { fontSize: "sm" }, tokenVars);
      expect(result).toEqual({ fontSize: `var(--${prefix}-font-sizes-sm)` });
    });

    it("resuelve alias de spacing — 'auto' → 'auto'", () => {
      const result = resolveStyle(theme, { padding: "auto" }, tokenVars);
      expect(result).toEqual({ padding: "auto" });
    });

    it("pasa valor CSS arbitrario sin modificar si no coincide con token", () => {
      const result = resolveStyle(theme, { padding: "8px" }, tokenVars);
      expect(result).toEqual({ padding: "8px" });
    });

    it("resuelve mezcla de props con y sin token", () => {
      const result = resolveStyle(theme, {
        padding: "md",
        cursor: "pointer",
        color: "primary.500",
      }, tokenVars);
      expect(result).toEqual({
        padding: `var(--${prefix}-spacing-md)`,
        cursor: "pointer",
        color: `var(--${prefix}-colors-primary-500)`,
      });
    });
  });

  // ─── forma función ────────────────────────────────────────────────────────
  describe("función con tema", () => {
    it("llama la función con el tema y resuelve el resultado", () => {
      const result = resolveStyle(theme, (t) => ({ padding: t.spacing.md }), tokenVars);
      expect(result).toEqual({ padding: theme.spacing.md });
    });

    it("función puede devolver tokens — se resuelven igual que el objeto", () => {
      const result = resolveStyle(theme, (_t) => ({ color: "primary.500" }), tokenVars);
      expect(result).toEqual({ color: `var(--${prefix}-colors-primary-500)` });
    });

    it("función que devuelve vacío → undefined", () => {
      const result = resolveStyle(theme, (_t) => ({}), tokenVars);
      expect(result).toBeUndefined();
    });
  });

  // ─── props de categoría raw ───────────────────────────────────────────────
  describe("categoría raw — sin resolución de token", () => {
    it("flexDirection pasa sin modificar", () => {
      const result = resolveStyle(theme, { flexDirection: "row" }, tokenVars);
      expect(result).toEqual({ flexDirection: "row" });
    });

    it("opacity — number se convierte a string por resolveValue", () => {
      const result = resolveStyle(theme, { opacity: 0.5 }, tokenVars);
      expect(result).toEqual({ opacity: "0.5" });
    });
  });
});
