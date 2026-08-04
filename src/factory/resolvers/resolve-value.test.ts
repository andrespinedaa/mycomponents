import { describe, it, expect } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import { generateTokens } from "../../theme/generators/generateTokens";
import { resolveValue } from "./resolve-value";

const p = defaultTheme.prefix;
const { vars: tokenVars } = generateTokens(defaultTheme);

describe("resolveValue", () => {
  // ─── raw ──────────────────────────────────────────────────────
  describe("category: raw", () => {
    it("retorna el valor sin transformar", () => {
      expect(resolveValue("flex", "raw", tokenVars)).toBe("flex");
    });

    it("retorna números como string", () => {
      expect(resolveValue(10, "raw", tokenVars)).toBe("10");
    });

    it("retorna valores CSS arbitrarios", () => {
      expect(resolveValue("1px solid red", "raw", tokenVars)).toBe("1px solid red");
    });

    it("retorna rgba sin transformar", () => {
      expect(resolveValue("rgba(0,0,0,0.5)", "raw", tokenVars)).toBe("rgba(0,0,0,0.5)");
    });
  });

  // ─── spacing ──────────────────────────────────────────────────
  describe("category: spacing", () => {
    it("resuelve token del tema a CSS var", () => {
      expect(resolveValue("md", "spacing", tokenVars)).toBe(`var(--${p}-spacing-md)`);
    });

    it("resuelve todos los tokens del tema a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.spacing)) {
        expect(resolveValue(key, "spacing", tokenVars)).toBe(`var(--${p}-spacing-${key})`);
      }
    });

    it("retorna valor arbitrario como escape hatch (no es token)", () => {
      expect(resolveValue("32px", "spacing", tokenVars)).toBe("32px");
    });

    it("resuelve alias 'full' a 100% (no es CSS var)", () => {
      expect(resolveValue("full", "spacing", tokenVars)).toBe("100%");
    });

    it("resuelve alias 'screen' a 100vw", () => {
      expect(resolveValue("screen", "spacing", tokenVars)).toBe("100vw");
    });

    it("resuelve alias 'fit' a fit-content", () => {
      expect(resolveValue("fit", "spacing", tokenVars)).toBe("fit-content");
    });

    it("resuelve alias 'auto' a auto", () => {
      expect(resolveValue("auto", "spacing", tokenVars)).toBe("auto");
    });

    it("retorna valor numérico como string (no es token)", () => {
      expect(resolveValue(0, "spacing", tokenVars)).toBe("0");
    });
  });

  // ─── colors ───────────────────────────────────────────────────
  describe("category: colors", () => {
    it("resuelve token de color a CSS var", () => {
      expect(resolveValue("primary.500", "colors", tokenVars)).toBe(
        `var(--${p}-colors-primary-500)`,
      );
    });

    it("resuelve todos los shades de primary a CSS vars", () => {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      for (const shade of shades) {
        expect(resolveValue(`primary.${shade}`, "colors", tokenVars)).toBe(
          `var(--${p}-colors-primary-${shade})`,
        );
      }
    });

    it("resuelve token de neutral a CSS var", () => {
      expect(resolveValue("neutral.100", "colors", tokenVars)).toBe(
        `var(--${p}-colors-neutral-100)`,
      );
    });

    it("resuelve token de danger a CSS var", () => {
      expect(resolveValue("danger.500", "colors", tokenVars)).toBe(
        `var(--${p}-colors-danger-500)`,
      );
    });

    it("retorna hex arbitrario como escape hatch (no es token)", () => {
      expect(resolveValue("#ff0000", "colors", tokenVars)).toBe("#ff0000");
    });

    it("retorna rgba arbitrario como escape hatch", () => {
      expect(resolveValue("rgba(255,0,0,0.5)", "colors", tokenVars)).toBe("rgba(255,0,0,0.5)");
    });

    it("retorna color desconocido sin transformar", () => {
      expect(resolveValue("unknown.500", "colors", tokenVars)).toBe("unknown.500");
    });
  });

  // ─── radius ───────────────────────────────────────────────────
  describe("category: radius", () => {
    it("resuelve token de radio a CSS var", () => {
      expect(resolveValue("md", "radius", tokenVars)).toBe(`var(--${p}-radius-md)`);
    });

    it("resuelve todos los tokens de radio a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.radius)) {
        expect(resolveValue(key, "radius", tokenVars)).toBe(`var(--${p}-radius-${key})`);
      }
    });

    it("retorna valor arbitrario como escape hatch", () => {
      expect(resolveValue("20px", "radius", tokenVars)).toBe("20px");
    });
  });

  // ─── fontSizes ────────────────────────────────────────────────
  describe("category: fontSizes", () => {
    it("resuelve token de fontSize a CSS var", () => {
      expect(resolveValue("md", "fontSizes", tokenVars)).toBe(
        `var(--${p}-font-sizes-md)`,
      );
    });

    it("resuelve todos los tokens de fontSize a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.fontSizes)) {
        expect(resolveValue(key, "fontSizes", tokenVars)).toBe(
          `var(--${p}-font-sizes-${key})`,
        );
      }
    });

    it("retorna valor arbitrario como escape hatch", () => {
      expect(resolveValue("20px", "fontSizes", tokenVars)).toBe("20px");
    });

    it("retorna token desconocido sin transformar", () => {
      expect(resolveValue("unknown", "fontSizes", tokenVars)).toBe("unknown");
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("retorna string vacío sin transformar", () => {
      expect(resolveValue("", "raw", tokenVars)).toBe("");
    });

    it("retorna 0 como string para spacing (no es token)", () => {
      expect(resolveValue(0, "spacing", tokenVars)).toBe("0");
    });

    it("número arbitrario en spacing retorna como string", () => {
      expect(resolveValue(999, "spacing", tokenVars)).toBe("999");
    });
  });
});
