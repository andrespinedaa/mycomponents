import { describe, it, expect, vi } from "vitest";
import { resolveMacros } from "./parse-macros";
import { defaultThemeMacros } from "../theme/theme.macros.data";

describe("resolveMacros", () => {

  // ─── sin apply ──────────────────────────────────────────────────────────────
  describe("sin apply", () => {
    it("retorna objeto vacío si apply es undefined", () => {
      expect(resolveMacros(undefined)).toEqual({});
    });

    it("retorna objeto vacío si apply es array vacío", () => {
      expect(resolveMacros([])).toEqual({});
    });
  });

  // ─── flex ────────────────────────────────────────────────────────────────────
  describe("flex macros", () => {
    it("resuelve @flexCenterCenter", () => {
      expect(resolveMacros("@flexCenterCenter")).toEqual({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
    });

    it("resuelve @flexStartEnd", () => {
      expect(resolveMacros("@flexStartEnd")).toEqual({
        display: "flex",
        alignItems: "start",
        justifyContent: "end",
      });
    });

    it("resuelve @flexFlexStartFlexEnd", () => {
      expect(resolveMacros("@flexFlexStartFlexEnd")).toEqual({
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      });
    });

    it("resuelve @flexCenterSpaceBetween", () => {
      expect(resolveMacros("@flexCenterSpaceBetween")).toEqual({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      });
    });

    it("resuelve @flexCenterSpaceAround", () => {
      expect(resolveMacros("@flexCenterSpaceAround")).toEqual({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      });
    });

    it("resuelve @flexCenterSpaceEvenly", () => {
      expect(resolveMacros("@flexCenterSpaceEvenly")).toEqual({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      });
    });

    it("resuelve @flexSafeCenterSafeCenter", () => {
      expect(resolveMacros("@flexSafeCenterSafeCenter")).toEqual({
        display: "flex",
        alignItems: "safe-center",
        justifyContent: "safe-center",
      });
    });

    it("resuelve @flexNormalNormal", () => {
      expect(resolveMacros("@flexNormalNormal")).toEqual({
        display: "flex",
        alignItems: "normal",
        justifyContent: "normal",
      });
    });

    it("resuelve @flexStretchStretch", () => {
      expect(resolveMacros("@flexStretchStretch")).toEqual({
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
      });
    });

    it("resuelve @inlineFlexCenterCenter", () => {
      expect(resolveMacros("@inlineFlexCenterCenter")).toEqual({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      });
    });
  });

  // ─── grid ────────────────────────────────────────────────────────────────────
  describe("grid macros", () => {
    it("resuelve @gridCenterCenter", () => {
      expect(resolveMacros("@gridCenterCenter")).toEqual({
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
      });
    });

    it("resuelve @gridStartEnd", () => {
      expect(resolveMacros("@gridStartEnd")).toEqual({
        display: "grid",
        alignItems: "start",
        justifyItems: "end",
      });
    });

    it("resuelve @inlineGridCenterCenter", () => {
      expect(resolveMacros("@inlineGridCenterCenter")).toEqual({
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "center",
      });
    });

    it("resuelve @gridCenterStretch", () => {
      expect(resolveMacros("@gridCenterStretch")).toEqual({
        display: "grid",
        alignItems: "center",
        justifyItems: "stretch",
      });
    });

    it("resuelve @gridCenterSelfStart", () => {
      expect(resolveMacros("@gridCenterSelfStart")).toEqual({
        display: "grid",
        alignItems: "center",
        justifyItems: "self-start",
      });
    });
  });

  // ─── custom macros del tema ───────────────────────────────────────────────────
  describe("custom macros", () => {
    it("resuelve macro custom del tema", () => {
      const result = resolveMacros("@flexCenter", defaultThemeMacros);
      expect(result).toMatchObject({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
    });

    it("custom macro tiene prioridad sobre built-in", () => {
      const customMacros = {
        "@flexCenterCenter": { display: "grid", gap: "1rem" },
      } as any;
      expect(resolveMacros("@flexCenterCenter", customMacros).display).toBe("grid");
    });
  });

  // ─── array de macros ─────────────────────────────────────────────────────────
  describe("array de macros", () => {
    it("combina múltiples macros", () => {
      const result = resolveMacros(["@flexCenterCenter", "@flexCenter"], defaultThemeMacros);
      expect(result.display).toBe("flex");
      expect(result.alignItems).toBe("center");
    });

    it("último macro gana en colisión", () => {
      const result = resolveMacros(["@flexCenterCenter", "@flexStartEnd"]);
      expect(result.alignItems).toBe("start");
      expect(result.justifyContent).toBe("end");
    });

    it("combina flex y custom macro", () => {
      const customMacros = { "@srOnly": { position: "absolute", width: "1px" } } as any;
      const result = resolveMacros(["@flexCenterCenter", "@srOnly"], customMacros);
      expect(result.display).toBe("flex");
      expect(result.position).toBe("absolute");
    });
  });

  // ─── macros inválidos ─────────────────────────────────────────────────────────
  describe("macros inválidos", () => {
    it("warn para macro no encontrado", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      resolveMacros("@noExiste" as any);
      expect(spy).toHaveBeenCalledWith('Macro "@noExiste" not found');
      spy.mockRestore();
    });

    it("macro inválido no rompe el resultado — continúa con los demás", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = resolveMacros(["@flexCenterCenter", "@noExiste" as any]);
      expect(result.display).toBe("flex");
      spy.mockRestore();
    });

    it("flex macro con token inválido — warn + resultado parcial", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = resolveMacros("@flexInvalidInvalid" as any);
      expect(spy).toHaveBeenCalled();
      // El parser retorna lo que pudo parsear antes de fallar (display ya estaba resuelto)
      expect(result).toMatchObject({ display: "flex" });
      spy.mockRestore();
    });
  });
});
