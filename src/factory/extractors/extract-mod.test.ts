import { describe, it, expect } from "vitest";
import { extractMod } from "./extract-mod";

describe("extractMod", () => {

  // ─── string ──────────────────────────────────────────────────
  describe("string", () => {
    it("string → data-{string}=true", () => {
      expect(extractMod("disabled")).toEqual({ "data-disabled": true });
    });

    it("array de strings", () => {
      expect(extractMod(["disabled", "active"])).toEqual({
        "data-disabled": true,
        "data-active": true,
      });
    });
  });

  // ─── boolean ─────────────────────────────────────────────────
  describe("boolean", () => {
    it("true es ignorado como entry (no es un key)", () => {
      expect(extractMod(true)).toEqual({});
    });

    it("false es ignorado", () => {
      expect(extractMod(false)).toEqual({});
    });

    it("boolean en array — ignorado", () => {
      expect(extractMod(["active", false, true])).toEqual({ "data-active": true });
    });
  });

  // ─── objeto plano ─────────────────────────────────────────────
  describe("objeto plano", () => {
    it("objeto → data-{key}={value}", () => {
      expect(extractMod({ orientation: "horizontal" })).toEqual({
        "data-orientation": "horizontal",
      });
    });

    it("filtra false", () => {
      expect(extractMod({ loading: false })).toEqual({});
    });

    it("filtra null", () => {
      expect(extractMod({ disabled: null })).toEqual({});
    });

    it("filtra undefined", () => {
      expect(extractMod({ active: undefined })).toEqual({});
    });

    it("incluye true", () => {
      expect(extractMod({ disabled: true })).toEqual({ "data-disabled": true });
    });

    it("incluye string", () => {
      expect(extractMod({ state: "loading" })).toEqual({ "data-state": "loading" });
    });
  });

  // ─── objeto con valor responsivo ──────────────────────────────
  describe("objeto con valor responsivo", () => {
    it("{ size: 'md' } → data-size=md", () => {
      expect(extractMod({ size: "md" })).toEqual({ "data-size": "md" });
    });

    it("{ size: { base, md } } → data-size + data-size-md", () => {
      expect(extractMod({ size: { base: "sm", md: "lg" } })).toEqual({
        "data-size": "sm",
        "data-size-md": "lg",
      });
    });

    it("{ size: { md, xl } } sin base — solo breakpoints declarados", () => {
      expect(extractMod({ size: { md: "lg", xl: "xl" } })).toEqual({
        "data-size-md": "lg",
        "data-size-xl": "xl",
      });
    });

    it("cualquier clave puede ser responsiva", () => {
      expect(extractMod({ gap: { base: "sm", lg: "xl" } })).toEqual({
        "data-gap": "sm",
        "data-gap-lg": "xl",
      });
    });
  });

  // ─── array mixto ─────────────────────────────────────────────
  describe("array mixto", () => {
    it("combina string y objeto", () => {
      expect(extractMod([{ orientation: "horizontal" }, "focused"])).toEqual({
        "data-orientation": "horizontal",
        "data-focused": true,
      });
    });

    it("último valor gana en colisión", () => {
      expect(extractMod([{ state: "idle" }, { state: "loading" }])).toEqual({
        "data-state": "loading",
      });
    });

    it("filtra falsy dentro del array", () => {
      expect(extractMod([{ loading: false, active: true }, "focused"])).toEqual({
        "data-active": true,
        "data-focused": true,
      });
    });

    it("null y undefined en array ignorados", () => {
      expect(extractMod([null, undefined, "active"])).toEqual({ "data-active": true });
    });
  });

  // ─── casos de uso reales ─────────────────────────────────────
  describe("casos de uso reales", () => {
    it("mod + variant + slot + size estático", () => {
      expect(extractMod([
        "focused",
        { variant: "solid" },
        { slot: "Button" },
        { size: "sm" },
      ])).toEqual({
        "data-focused": true,
        "data-variant": "solid",
        "data-slot": "Button",
        "data-size": "sm",
      });
    });

    it("mod + variant + slot + size responsivo", () => {
      expect(extractMod([
        "focused",
        { variant: "solid" },
        { slot: "Button" },
        { size: { base: "sm", md: "lg" } },
      ])).toEqual({
        "data-focused": true,
        "data-variant": "solid",
        "data-slot": "Button",
        "data-size": "sm",
        "data-size-md": "lg",
      });
    });

    it("variant falsy → no se incluye", () => {
      expect(extractMod([
        { slot: "Input" },
        undefined,
      ])).toEqual({ "data-slot": "Input" });
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("sin argumentos → objeto vacío", () => {
      expect(extractMod()).toEqual({});
    });

    it("undefined → objeto vacío", () => {
      expect(extractMod(undefined)).toEqual({});
    });

    it("objeto vacío → objeto vacío", () => {
      expect(extractMod({})).toEqual({});
    });

    it("array vacío → objeto vacío", () => {
      expect(extractMod([])).toEqual({});
    });

    it("todos los valores falsy → objeto vacío", () => {
      expect(extractMod({ a: false, b: null, c: undefined })).toEqual({});
    });
  });
});
