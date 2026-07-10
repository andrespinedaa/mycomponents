import { describe, expect, it } from "vitest";
import type { Theme } from "../core/theme.types";
import { generateComponentBases } from "./generateBases";

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentBases ──────────────────────────────────────────────────

describe("generateComponentBases", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay variants, sizes ni presets", () => {
      const config: TestConfig = {};
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si variants existe pero todos los estados tienen tokens vacíos", () => {
      const config: TestConfig = {
        variants: { Default: { base: {} } },
      };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si sizes existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { sizes: { md: {} } };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si presets existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { presets: { horizontal: {} } };
      expect(generateComponentBases("Card", config)).toBe("");
    });
  });

  describe("prefix derivado de componentName", () => {
    it("deriva el prefix de camelToKebab(componentName)", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentBases("Card", config);
      expect(result).toContain("var(--card-background,unset)");
    });

    it("convierte camelCase a kebab-case correctamente", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentBases("myCard", config);
      expect(result).toContain("var(--my-card-background,unset)");
    });
  });

  describe("selector y CSS generado", () => {
    it("genera el selector [data-slot] con la prop CSS correcta", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — rounded → border-radius", () => {
      const config: TestConfig = {
        variants: { Default: { base: { rounded: "lg" } } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{border-radius:var(--card-border-radius,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — p → padding", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{padding:var(--card-padding,unset);}`,
      );
    });

    it("slot component con parentName genera selector con data-slot-parent", () => {
      const config: TestConfig = {
        parentName: "Card",
        presets: { header: { borderBottom: "1px solid" } },
      };
      const result = generateComponentBases("Section", config);
      expect(result).toContain(`[data-slot="Section"][data-slot-parent="Card"]`);
    });

    it("presets planos sí contribuyen al base reset", () => {
      const config: TestConfig = {
        presets: { horizontal: { w: "100%" } },
      };
      expect(generateComponentBases("Divider", config)).toBe(
        `[data-slot="Divider"]{width:var(--divider-width,unset);}`,
      );
    });

    it("genera múltiples props en un solo selector", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50", rounded: "lg" } } },
      };
      const result = generateComponentBases("Card", config);
      expect(result).toContain("background:var(--card-background,unset);");
      expect(result).toContain("border-radius:var(--card-border-radius,unset);");
      expect(result).toMatch(/^\[data-slot="Card"\]\{.+\}$/);
    });
  });

  describe("deduplicación", () => {
    it("deduplica keys que aparecen en variants y sizes — bg aparece una sola vez", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
        sizes: { md: { bg: "primary.500" } },
      };
      const result = generateComponentBases("Card", config);
      expect(result).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("deduplica keys que aparecen en variants, sizes y presets", () => {
      const config: TestConfig = {
        variants: { Default: { base: { w: "100%" } } },
        sizes: { md: { w: "100%" } },
        presets: { horizontal: { w: "100%" } },
      };
      const result = generateComponentBases("Divider", config);
      const widthCount = (result.match(/width:/g) ?? []).length;
      expect(widthCount).toBe(1);
    });

    it("acumula keys únicas de variantes múltiples", () => {
      const config: TestConfig = {
        variants: {
          Default: { base: { bg: "neutral.50" } },
          Filled: { base: { rounded: "lg" } },
        },
      };
      const result = generateComponentBases("Card", config);
      expect(result).toContain("background:var(--card-background,unset);");
      expect(result).toContain("border-radius:var(--card-border-radius,unset);");
    });
  });
});
