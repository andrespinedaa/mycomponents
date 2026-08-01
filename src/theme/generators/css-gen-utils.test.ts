import { describe, expect, it } from "vitest";
import { resolveVars } from "../../system/resolvers/resolve-vars";

describe("resolveVars", () => {
  describe("sin $prop — retorna referencia igual", () => {
    it("retorna undefined si vars es undefined", () => {
      expect(resolveVars(undefined, "card")).toBeUndefined();
    });

    it("retorna la misma referencia si ningún valor tiene $", () => {
      const vars = { "--card-color": "red", "--x": "1px solid blue" };
      expect(resolveVars(vars, "card")).toBe(vars);
    });
  });

  describe("forma standalone — $prop ocupa todo el valor", () => {
    it("resuelve $propName a var(--prefix-css-prop)", () => {
      const result = resolveVars({ "--x": "$color" }, "card");
      expect(result?.["--x"]).toBe("var(--card-color)");
    });

    it("resuelve alias: $bg → var(--prefix-background)", () => {
      const result = resolveVars({ "--x": "$bg" }, "card");
      expect(result?.["--x"]).toBe("var(--card-background)");
    });

    it("resuelve $borderColor → var(--prefix-border-color)", () => {
      const result = resolveVars({ "--x": "$borderColor" }, "card");
      expect(result?.["--x"]).toBe("var(--card-border-color)");
    });

    it("usa el prefix del componente, no del padre", () => {
      const result = resolveVars({ "--x": "$color" }, "card-slots");
      expect(result?.["--x"]).toBe("var(--card-slots-color)");
    });
  });

  describe("forma inline — $prop dentro de un valor compuesto", () => {
    it("resuelve $prop embebido", () => {
      const result = resolveVars({ "--x": "1px solid $borderColor" }, "card");
      expect(result?.["--x"]).toBe("1px solid var(--card-border-color)");
    });

    it("resuelve múltiples $prop en el mismo valor", () => {
      const result = resolveVars({ "--x": "0 0 0 1px $borderColor, inset 0 0 0 1px $color" }, "card");
      expect(result?.["--x"]).toBe("0 0 0 1px var(--card-border-color), inset 0 0 0 1px var(--card-color)");
    });
  });

  describe("mezcla de props con y sin $", () => {
    it("resuelve solo las entradas que tienen $", () => {
      const result = resolveVars(
        { "--plain": "red", "--dsl": "$color" },
        "card",
      );
      expect(result?.["--plain"]).toBe("red");
      expect(result?.["--dsl"]).toBe("var(--card-color)");
    });

    it("retorna un objeto nuevo cuando al menos un valor cambia", () => {
      const vars = { "--plain": "red", "--dsl": "$color" };
      const result = resolveVars(vars, "card");
      expect(result).not.toBe(vars);
    });
  });
});
