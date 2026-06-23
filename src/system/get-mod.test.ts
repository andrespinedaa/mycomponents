// src/utils/get-mod.test.ts
import { describe, it, expect } from "vitest";
import { getMod } from "./get-mod";

describe("getMod", () => {

  // ─── String simple ───────────────────────────────────────────
  describe("string", () => {
    it("convierte string a data attribute con valor true", () => {
      expect(getMod("disabled")).toEqual({ "data-disabled": true });
    });

    it("convierte múltiples strings en array", () => {
      expect(getMod(["disabled", "active"])).toEqual({
        "data-disabled": true,
        "data-active": true,
      });
    });
  });

  // ─── Objeto ───────────────────────────────────────────────────
  describe("objeto", () => {
    it("convierte objeto a data attributes", () => {
      expect(getMod({ variant: "solid", size: "md" })).toEqual({
        "data-variant": "solid",
        "data-size": "md",
      });
    });

    it("filtra valores false", () => {
      expect(getMod({ loading: false })).toEqual({});
    });

    it("filtra valores null", () => {
      expect(getMod({ disabled: null })).toEqual({});
    });

    it("filtra valores undefined", () => {
      expect(getMod({ active: undefined })).toEqual({});
    });

    it("incluye valores true", () => {
      expect(getMod({ disabled: true })).toEqual({
        "data-disabled": true,
      });
    });

    it("incluye valores string", () => {
      expect(getMod({ variant: "solid" })).toEqual({
        "data-variant": "solid",
      });
    });

    it("incluye valores number", () => {
      expect(getMod({ order: 2 })).toEqual({
        "data-order": 2,
      });
    });
  });

  // ─── Array mixto ─────────────────────────────────────────────
  describe("array mixto", () => {
    it("combina string y objeto", () => {
      expect(getMod([{ variant: "solid" }, "focused"])).toEqual({
        "data-variant": "solid",
        "data-focused": true,
      });
    });

    it("último valor gana en colisión", () => {
      expect(getMod([{ variant: "solid" }, { variant: "outline" }])).toEqual({
        "data-variant": "outline",
      });
    });

    it("filtra falsy dentro del array", () => {
      expect(getMod([{ loading: false, active: true }, "focused"])).toEqual({
        "data-active": true,
        "data-focused": true,
      });
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("retorna objeto vacío si mod es undefined", () => {
      expect(getMod(undefined)).toEqual({});
    });

    it("retorna objeto vacío si objeto está vacío", () => {
      expect(getMod({})).toEqual({});
    });

    it("retorna objeto vacío si array está vacío", () => {
      expect(getMod([])).toEqual({});
    });

    it("retorna objeto vacío si todos los valores son falsy", () => {
      expect(getMod({ a: false, b: null, c: undefined })).toEqual({});
    });
  });

});