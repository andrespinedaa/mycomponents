import { describe, expect, it } from "vitest";
import { resolveVars } from "../../factory/resolvers/resolve-vars";
import { generateTokens } from "./generateTokens";
import { defaultTheme } from "../../theme/themes/default-theme";

const { vars: tokenVars } = generateTokens(defaultTheme);

describe("resolveVars", () => {
  describe("sin $prop — retorna referencia igual", () => {
    it("retorna undefined si vars es undefined", () => {
      expect(resolveVars("card", undefined)).toBeUndefined();
    });

    it("retorna la misma referencia si ningún valor tiene $", () => {
      const vars = { "--card-color": "red", "--x": "1px solid blue" };
      expect(resolveVars("card", vars)).toBe(vars);
    });
  });

  describe("forma standalone — $prop ocupa todo el valor", () => {
    it("resuelve $propName a var(--prefix-css-prop)", () => {
      const result = resolveVars("card", { "--x": "$color" });
      expect(result?.["--x"]).toBe("var(--card-color)");
    });

    it("resuelve alias: $bg → var(--prefix-background)", () => {
      const result = resolveVars("card", { "--x": "$bg" });
      expect(result?.["--x"]).toBe("var(--card-background)");
    });

    it("resuelve $borderColor → var(--prefix-border-color)", () => {
      const result = resolveVars("card", { "--x": "$borderColor" });
      expect(result?.["--x"]).toBe("var(--card-border-color)");
    });

    it("usa el prefix del componente, no del padre", () => {
      const result = resolveVars("card-slots", { "--x": "$color" });
      expect(result?.["--x"]).toBe("var(--card-slots-color)");
    });
  });

  describe("forma inline — $prop dentro de un valor compuesto", () => {
    it("resuelve $prop embebido", () => {
      const result = resolveVars("card", { "--x": "1px solid $borderColor" });
      expect(result?.["--x"]).toBe("1px solid var(--card-border-color)");
    });

    it("resuelve múltiples $prop en el mismo valor", () => {
      const result = resolveVars("card", { "--x": "0 0 0 1px $borderColor, inset 0 0 0 1px $color" });
      expect(result?.["--x"]).toBe("0 0 0 1px var(--card-border-color), inset 0 0 0 1px var(--card-color)");
    });
  });

  describe("mezcla de props con y sin $", () => {
    it("resuelve solo las entradas que tienen $", () => {
      const result = resolveVars("card", { "--plain": "red", "--dsl": "$color" });
      expect(result?.["--plain"]).toBe("red");
      expect(result?.["--dsl"]).toBe("var(--card-color)");
    });

    it("retorna un objeto nuevo cuando al menos un valor cambia", () => {
      const vars = { "--plain": "red", "--dsl": "$color" };
      const result = resolveVars("card", vars);
      expect(result).not.toBe(vars);
    });
  });

  describe("token de color — word.número", () => {
    it("resuelve primary.500 a CSS var del tema", () => {
      const result = resolveVars("card", { "--bg": "primary.500" }, tokenVars);
      const p = defaultTheme.prefix;
      expect(result?.["--bg"]).toBe(`var(--${p}-colors-primary-500)`);
    });

    it("resuelve neutral.100 a CSS var del tema", () => {
      const result = resolveVars("card", { "--color": "neutral.100" }, tokenVars);
      const p = defaultTheme.prefix;
      expect(result?.["--color"]).toBe(`var(--${p}-colors-neutral-100)`);
    });

    it("valor desconocido como color pasa crudo", () => {
      const result = resolveVars("card", { "--bg": "unknown.500" }, tokenVars);
      expect(result?.["--bg"]).toBe("unknown.500");
    });
  });

  describe("token de categoría — word.palabra", () => {
    it("resuelve spacing.md a CSS var del tema", () => {
      const result = resolveVars("card", { "--gap": "spacing.md" }, tokenVars);
      const p = defaultTheme.prefix;
      expect(result?.["--gap"]).toBe(`var(--${p}-spacing-md)`);
    });

    it("resuelve fontSizes.xl a CSS var del tema", () => {
      const result = resolveVars("card", { "--size": "fontSizes.xl" }, tokenVars);
      const p = defaultTheme.prefix;
      expect(result?.["--size"]).toBe(`var(--${p}-font-sizes-xl)`);
    });

    it("resuelve radius.lg a CSS var del tema", () => {
      const result = resolveVars("card", { "--r": "radius.lg" }, tokenVars);
      const p = defaultTheme.prefix;
      expect(result?.["--r"]).toBe(`var(--${p}-radius-lg)`);
    });

    it("categoría desconocida pasa crudo", () => {
      const result = resolveVars("card", { "--x": "unknown.token" }, tokenVars);
      expect(result?.["--x"]).toBe("unknown.token");
    });
  });

  describe("CSS puro — última instancia", () => {
    it("pasa valores raw sin modificar", () => {
      const result = resolveVars("card", { "--x": "8px", "--y": "red", "--z": "1.5rem" });
      expect(result?.["--x"]).toBe("8px");
      expect(result?.["--y"]).toBe("red");
      expect(result?.["--z"]).toBe("1.5rem");
    });
  });
});
