import { describe, it, expect } from "vitest";
import { defaultTheme } from "../theme/default-theme";
import { resolveValue } from "./resolve-value";

const p = defaultTheme.cssVarPrefix;

describe("resolveValue", () => {
  // ─── raw ──────────────────────────────────────────────────────
  describe("category: raw", () => {
    it("retorna el valor sin transformar", () => {
      expect(resolveValue("flex", "raw", defaultTheme)).toBe("flex");
    });

    it("retorna números como string", () => {
      expect(resolveValue(10, "raw", defaultTheme)).toBe("10");
    });

    it("retorna valores CSS arbitrarios", () => {
      expect(resolveValue("1px solid red", "raw", defaultTheme)).toBe("1px solid red");
    });

    it("retorna rgba sin transformar", () => {
      expect(resolveValue("rgba(0,0,0,0.5)", "raw", defaultTheme)).toBe("rgba(0,0,0,0.5)");
    });
  });

  // ─── spacing ──────────────────────────────────────────────────
  describe("category: spacing", () => {
    it("resuelve token del tema a CSS var", () => {
      expect(resolveValue("md", "spacing", defaultTheme)).toBe(`var(--${p}-spacing-md)`);
    });

    it("resuelve todos los tokens del tema a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.spacing)) {
        expect(resolveValue(key, "spacing", defaultTheme)).toBe(`var(--${p}-spacing-${key})`);
      }
    });

    it("retorna valor arbitrario como escape hatch (no es token)", () => {
      expect(resolveValue("32px", "spacing", defaultTheme)).toBe("32px");
    });

    it("resuelve alias 'full' a 100% (no es CSS var)", () => {
      expect(resolveValue("full", "spacing", defaultTheme)).toBe("100%");
    });

    it("resuelve alias 'screen' a 100vw", () => {
      expect(resolveValue("screen", "spacing", defaultTheme)).toBe("100vw");
    });

    it("resuelve alias 'fit' a fit-content", () => {
      expect(resolveValue("fit", "spacing", defaultTheme)).toBe("fit-content");
    });

    it("resuelve alias 'auto' a auto", () => {
      expect(resolveValue("auto", "spacing", defaultTheme)).toBe("auto");
    });

    it("retorna valor numérico como string (no es token)", () => {
      expect(resolveValue(0, "spacing", defaultTheme)).toBe("0");
    });
  });

  // ─── color ────────────────────────────────────────────────────
  describe("category: color", () => {
    it("resuelve token de color a CSS var", () => {
      expect(resolveValue("primary.500", "color", defaultTheme)).toBe(
        `var(--${p}-color-primary-500)`,
      );
    });

    it("resuelve todos los shades de primary a CSS vars", () => {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      for (const shade of shades) {
        expect(resolveValue(`primary.${shade}`, "color", defaultTheme)).toBe(
          `var(--${p}-color-primary-${shade})`,
        );
      }
    });

    it("resuelve token de neutral a CSS var", () => {
      expect(resolveValue("neutral.100", "color", defaultTheme)).toBe(
        `var(--${p}-color-neutral-100)`,
      );
    });

    it("resuelve token de danger a CSS var", () => {
      expect(resolveValue("danger.500", "color", defaultTheme)).toBe(
        `var(--${p}-color-danger-500)`,
      );
    });

    it("retorna hex arbitrario como escape hatch (no es token)", () => {
      expect(resolveValue("#ff0000", "color", defaultTheme)).toBe("#ff0000");
    });

    it("retorna rgba arbitrario como escape hatch", () => {
      expect(resolveValue("rgba(255,0,0,0.5)", "color", defaultTheme)).toBe("rgba(255,0,0,0.5)");
    });

    it("retorna color desconocido sin transformar", () => {
      expect(resolveValue("unknown.500", "color", defaultTheme)).toBe("unknown.500");
    });
  });

  // ─── radius ───────────────────────────────────────────────────
  describe("category: radius", () => {
    it("resuelve token de radio a CSS var", () => {
      expect(resolveValue("md", "radius", defaultTheme)).toBe(`var(--${p}-radius-md)`);
    });

    it("resuelve todos los tokens de radio a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.radii)) {
        expect(resolveValue(key, "radius", defaultTheme)).toBe(`var(--${p}-radius-${key})`);
      }
    });

    it("retorna valor arbitrario como escape hatch", () => {
      expect(resolveValue("20px", "radius", defaultTheme)).toBe("20px");
    });
  });

  // ─── fontSize ─────────────────────────────────────────────────
  describe("category: fontSize", () => {
    it("resuelve token de fontSize a CSS var", () => {
      expect(resolveValue("md", "fontSize", defaultTheme)).toBe(
        `var(--${p}-font-size-md)`,
      );
    });

    it("resuelve todos los tokens de fontSize a CSS vars", () => {
      for (const key of Object.keys(defaultTheme.fontSizes)) {
        expect(resolveValue(key, "fontSize", defaultTheme)).toBe(
          `var(--${p}-font-size-${key})`,
        );
      }
    });

    it("retorna valor arbitrario como escape hatch", () => {
      expect(resolveValue("20px", "fontSize", defaultTheme)).toBe("20px");
    });

    it("retorna token desconocido sin transformar", () => {
      expect(resolveValue("unknown", "fontSize", defaultTheme)).toBe("unknown");
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("retorna string vacío sin transformar", () => {
      expect(resolveValue("", "raw", defaultTheme)).toBe("");
    });

    it("retorna 0 como string para spacing (no es token)", () => {
      expect(resolveValue(0, "spacing", defaultTheme)).toBe("0");
    });

    it("número arbitrario en spacing retorna como string", () => {
      expect(resolveValue(999, "spacing", defaultTheme)).toBe("999");
    });
  });
});
