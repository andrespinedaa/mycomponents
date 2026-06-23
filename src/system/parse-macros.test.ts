// src/utils/resolve-macros.test.ts
import { describe, it, expect, vi } from "vitest";
import {
  macroToCssValue,
  isFlexMacro,
  isGridMacro,
  createMacroParser,
  parseFlexMacros,
  parseGridMacros,
  resolveMacros,
} from "./parse-macros";
import { defaultThemeMacros } from "../theme/theme.macros.data";

describe("macroToCssValue", () => {
  it("convierte camelCase a kebab-case", () => {
    expect(macroToCssValue("FlexStart")).toBe("flex-start");
    expect(macroToCssValue("SpaceBetween")).toBe("space-between");
    expect(macroToCssValue("SpaceAround")).toBe("space-around");
    expect(macroToCssValue("SpaceEvenly")).toBe("space-evenly");
    expect(macroToCssValue("SafeCenter")).toBe("safe-center");
    expect(macroToCssValue("UnsafeCenter")).toBe("unsafe-center");
  });

  it("convierte valores simples a lowercase", () => {
    expect(macroToCssValue("Center")).toBe("center");
    expect(macroToCssValue("Start")).toBe("start");
    expect(macroToCssValue("End")).toBe("end");
    expect(macroToCssValue("Normal")).toBe("normal");
    expect(macroToCssValue("Stretch")).toBe("stretch");
  });

  it("convierte inlineFlex correctamente", () => {
    expect(macroToCssValue("inlineFlex")).toBe("inline-flex");
  });

  it("convierte inlineGrid correctamente", () => {
    expect(macroToCssValue("inlineGrid")).toBe("inline-grid");
  });
});

// ─── isFlexMacro ──────────────────────────────────────────────────────────────
describe("isFlexMacro", () => {
  it("detecta macros flex", () => {
    expect(isFlexMacro("@flexCenterCenter")).toBe(true);
    expect(isFlexMacro("@flexStartEnd")).toBe(true);
  });

  it("detecta macros inlineFlex", () => {
    expect(isFlexMacro("@inlineFlexCenterCenter")).toBe(true);
  });

  it("rechaza macros que no son flex", () => {
    expect(isFlexMacro("@gridCenterCenter")).toBe(false);
    expect(isFlexMacro("@truncate")).toBe(false);
    expect(isFlexMacro("@srOnly")).toBe(false);
  });

  it("lanza error con macro flex incompleto", () => {
    expect(() => parseFlexMacros("@flexCenter" as any)).toThrow();
  });
});

// ─── isGridMacro ──────────────────────────────────────────────────────────────
describe("isGridMacro", () => {
  it("detecta macros grid", () => {
    expect(isGridMacro("@gridCenterCenter")).toBe(true);
    expect(isGridMacro("@gridStartEnd")).toBe(true);
  });

  it("detecta macros inlineGrid", () => {
    expect(isGridMacro("@inlineGridCenterCenter")).toBe(true);
  });

  it("rechaza macros que no son grid", () => {
    expect(isGridMacro("@flexCenterCenter")).toBe(false);
    expect(isGridMacro("@truncate")).toBe(false);
  });
});

// ─── createMacroParser ────────────────────────────────────────────────────────
describe("createMacroParser", () => {
  it("parsea un macro simple", () => {
    const parser = createMacroParser({
      display: ["flex", "inlineFlex"],
      alignItems: ["Center", "Start", "End"],
      justifyContent: ["Center", "Start", "End"],
    });
    expect(parser("@flexCenterCenter")).toEqual({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("parsea inlineFlex correctamente", () => {
    const parser = createMacroParser({
      display: ["flex", "inlineFlex"],
      alignItems: ["Center", "Start"],
      justifyContent: ["Center", "Start"],
    });
    expect(parser("@inlineFlexCenterCenter")).toEqual({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("lanza error si no puede parsear el token", () => {
    const parser = createMacroParser({
      display: ["flex"],
      alignItems: ["Center"],
      justifyContent: ["Center"],
    });
    expect(() => parser("@unknownCenterCenter")).toThrow();
  });

  it("lanza error si hay tokens extra al final", () => {
    const parser = createMacroParser({
      display: ["flex"],
      alignItems: ["Center"],
      justifyContent: ["Center"],
    });
    expect(() => parser("@flexCenterCenterEXTRA")).toThrow(
      'Unexpected token "EXTRA"',
    );
  });

  it("pre-sortea por longitud — tokens más largos tienen prioridad", () => {
    const parser = createMacroParser({
      display: ["flex", "inlineFlex"], // inlineFlex es más largo
      alignItems: ["Center"],
      justifyContent: ["Center"],
    });
    // inlineFlex debe ganar sobre flex
    expect(parser("@inlineFlexCenterCenter").display).toBe("inline-flex");
  });
});

// ─── parseFlexMacros ──────────────────────────────────────────────────────────
describe("parseFlexMacros", () => {
  it("parsea @flexCenterCenter", () => {
    expect(parseFlexMacros("@flexCenterCenter")).toEqual({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("parsea @flexStartEnd", () => {
    expect(parseFlexMacros("@flexStartEnd")).toEqual({
      display: "flex",
      alignItems: "start",
      justifyContent: "end",
    });
  });

  it("parsea @flexFlexStartFlexEnd", () => {
    expect(parseFlexMacros("@flexFlexStartFlexEnd")).toEqual({
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
    });
  });

  it("parsea @flexSpaceBetweenCenter — justifyContent largo", () => {
    expect(parseFlexMacros("@flexCenterSpaceBetween")).toEqual({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    });
  });

  it("parsea @flexCenterSpaceAround", () => {
    expect(parseFlexMacros("@flexCenterSpaceAround")).toEqual({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
    });
  });

  it("parsea @flexCenterSpaceEvenly", () => {
    expect(parseFlexMacros("@flexCenterSpaceEvenly")).toEqual({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
    });
  });

  it("parsea @inlineFlexCenterCenter", () => {
    expect(parseFlexMacros("@inlineFlexCenterCenter")).toEqual({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("parsea @flexNormalNormal", () => {
    expect(parseFlexMacros("@flexNormalNormal")).toEqual({
      display: "flex",
      alignItems: "normal",
      justifyContent: "normal",
    });
  });

  it("parsea @flexStretchStretch", () => {
    expect(parseFlexMacros("@flexStretchStretch")).toEqual({
      display: "flex",
      alignItems: "stretch",
      justifyContent: "stretch",
    });
  });

  it("parsea @flexSafeCenter correctamente", () => {
    expect(parseFlexMacros("@flexSafeCenterSafeCenter")).toEqual({
      display: "flex",
      alignItems: "safe-center",
      justifyContent: "safe-center",
    });
  });

  it("lanza error con macro flex inválido", () => {
    expect(() => parseFlexMacros("@flexInvalidInvalid" as any)).toThrow();
  });
});

// ─── parseGridMacros ──────────────────────────────────────────────────────────
describe("parseGridMacros", () => {
  it("parsea @gridCenterCenter", () => {
    expect(parseGridMacros("@gridCenterCenter")).toEqual({
      display: "grid",
      alignItems: "center",
      justifyItems: "center",
    });
  });

  it("parsea @gridStartEnd", () => {
    expect(parseGridMacros("@gridStartEnd")).toEqual({
      display: "grid",
      alignItems: "start",
      justifyItems: "end",
    });
  });

  it("parsea @inlineGridCenterCenter", () => {
    expect(parseGridMacros("@inlineGridCenterCenter")).toEqual({
      display: "inline-grid",
      alignItems: "center",
      justifyItems: "center",
    });
  });

  it("parsea @gridCenterStretch", () => {
    expect(parseGridMacros("@gridCenterStretch")).toEqual({
      display: "grid",
      alignItems: "center",
      justifyItems: "stretch",
    });
  });

  it("parsea @gridCenterSelfStart", () => {
    expect(parseGridMacros("@gridCenterSelfStart")).toEqual({
      display: "grid",
      alignItems: "center",
      justifyItems: "self-start",
    });
  });

  it("lanza error con macro grid inválido", () => {
    expect(() => parseGridMacros("@gridInvalidInvalid" as any)).toThrow();
  });
});

// ─── resolveMacros ────────────────────────────────────────────────────────────
describe("resolveMacros", () => {
  // ─── sin apply ──────────────────────────────────────────────
  describe("sin apply", () => {
    it("retorna objeto vacío si apply es undefined", () => {
      expect(resolveMacros(undefined)).toEqual({});
    });
  });

  // ─── flex ────────────────────────────────────────────────────
  describe("flex macros", () => {
    it("resuelve macro flex simple", () => {
      expect(resolveMacros("@flexCenterCenter")).toEqual({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });
    });

    it("resuelve @flexStartSpaceBetween", () => {
      expect(resolveMacros("@flexStartSpaceBetween")).toEqual({
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
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

  // ─── grid ────────────────────────────────────────────────────
  describe("grid macros", () => {
    it("resuelve macro grid simple", () => {
      expect(resolveMacros("@gridCenterCenter")).toEqual({
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
      });
    });

    it("resuelve @inlineGridStartEnd", () => {
      expect(resolveMacros("@inlineGridStartEnd")).toEqual({
        display: "inline-grid",
        alignItems: "start",
        justifyItems: "end",
      });
    });
  });

  // ─── custom macros ───────────────────────────────────────────
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
        "@flexCenterCenter": {
          display: "grid", // sobreescribe el flex built-in
          gap: "1rem",
        },
      } as any;
      const result = resolveMacros("@flexCenterCenter", customMacros);
      expect(result.display).toBe("grid");
    });
  });

  // ─── array de macros ─────────────────────────────────────────
  describe("array de macros", () => {
    it("combina múltiples macros", () => {
      const result = resolveMacros(
        ["@flexCenterCenter", "@flexCenter"],
        defaultThemeMacros,
      );
      expect(result.display).toBe("flex");
      expect(result.alignItems).toBe("center");
    });

    it("último macro gana en colisión", () => {
      const result = resolveMacros(["@flexCenterCenter", "@flexStartEnd"]);
      expect(result.alignItems).toBe("start"); // último gana
      expect(result.justifyContent).toBe("end");
    });

    it("combina flex y custom macro", () => {
      const customMacros = {
        "@srOnly": { position: "absolute", width: "1px" },
      } as any;
      const result = resolveMacros(
        ["@flexCenterCenter", "@srOnly"],
        customMacros,
      );
      expect(result.display).toBe("flex");
      expect(result.position).toBe("absolute");
    });
  });

  // ─── macros inválidos ─────────────────────────────────────────
  describe("macros inválidos", () => {
    it("warn en desarrollo para macro no encontrado", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      resolveMacros("@noExiste" as any);
      expect(spy).toHaveBeenCalledWith('Macro "@noExiste" not found');
      spy.mockRestore();
    });

    it("macro inválido no rompe el resultado", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = resolveMacros(["@flexCenterCenter", "@noExiste" as any]);
      expect(result.display).toBe("flex");
      spy.mockRestore();
    });
  });
});
