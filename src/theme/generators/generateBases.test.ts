import { describe, expect, it } from "vitest";
import type { Theme } from "../core/theme.types";
import { generateComponentBases } from "./generateBases";
import { parseComponentConfig } from "./parseComponentConfig";
import { generateNames } from "./generateComponents";
import type { GeneratorConfig } from "./css-gen-utils";
import type { ComponentName } from "../core";

type TestConfig = Partial<NonNullable<Theme["components"]>[ComponentName]>;

function callBases(name: string, config: TestConfig): string {
  return generateComponentBases(
    generateNames(name, config as GeneratorConfig),
    parseComponentConfig(config as GeneratorConfig).usedKeys,
  );
}

// ─── generateComponentBases ──────────────────────────────────────────────────

describe("generateComponentBases", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay variants, sizes ni presets", () => {
      const config: TestConfig = {};
      expect(callBases("Card", config)).toBe("");
    });

    it("retorna vacío si variants existe pero no tiene tokens en ningún nivel", () => {
      const config: TestConfig = {
        variants: { Filled: {} },
      };
      expect(callBases("Card", config)).toBe("");
    });

    it("retorna vacío si sizes existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { sizes: { md: {} } as any };
      expect(callBases("Card", config)).toBe("");
    });

    it("retorna vacío si presets existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { presets: { horizontal: {} } };
      expect(callBases("Card", config)).toBe("");
    });
  });

  describe("prefix derivado de name", () => {
    it("deriva el prefix de camelToKebab(name) — flat token en variants", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      const result = callBases("Card", config);
      expect(result).toContain("var(--card-background,unset)");
    });

    it("convierte camelCase a kebab-case correctamente", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      const result = callBases("myCard", config);
      expect(result).toContain("var(--my-card-background,unset)");
    });
  });

  describe("selector y CSS generado", () => {
    it("genera el selector [data-slot] con la prop CSS correcta — flat token", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      expect(callBases("Card", config)).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("genera el selector [data-slot] con token en variante nombrada", () => {
      const config: TestConfig = {
        variants: { Filled: { bg: "primary.50" } },
      };
      expect(callBases("Card", config)).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("genera el selector [data-slot] con token en estado dentro de variante", () => {
      const config: TestConfig = {
        variants: { Filled: { hover: { bg: "primary.100" } } },
      };
      expect(callBases("Card", config)).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — rounded → border-radius", () => {
      const config: TestConfig = {
        variants: { rounded: "lg" } as any,
      };
      expect(callBases("Card", config)).toBe(
        `[data-slot="Card"]{border-radius:var(--card-border-radius,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — p → padding (desde sizes)", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } } as any,
      };
      expect(callBases("Card", config)).toBe(
        `[data-slot="Card"]{padding:var(--card-padding,unset);}`,
      );
    });

    it("slot component con parentName genera selector simple sin data-slot-parent", () => {
      const config: TestConfig = {
        parentName: "Card",
        presets: { header: { borderBottom: "1px solid" } },
      };
      const result = callBases("Section", config);
      expect(result).toContain(`[data-slot="Section"]`);
      expect(result).not.toContain(`data-slot-parent`);
    });

    it("presets planos sí contribuyen al base reset", () => {
      const config: TestConfig = {
        presets: { horizontal: { w: "100%" } },
      };
      expect(callBases("Divider", config)).toBe(
        `[data-slot="Divider"]{width:var(--divider-width,unset);}`,
      );
    });

    it("genera múltiples props en un solo selector", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50", rounded: "lg" } as any,
      };
      const result = callBases("Card", config);
      expect(result).toContain("background:var(--card-background,unset);");
      expect(result).toContain("border-radius:var(--card-border-radius,unset);");
      expect(result).toMatch(/^\[data-slot="Card"\]\{.+\}$/);
    });
  });

  describe("deduplicación", () => {
    it("deduplica keys que aparecen en flat base y sizes — bg aparece una sola vez", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
        sizes: { md: { bg: "primary.500" } } as any,
      };
      const result = callBases("Card", config);
      expect(result).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("deduplica keys que aparecen en variants, sizes y presets", () => {
      const config: TestConfig = {
        variants: { w: "100%" } as any,
        sizes: { md: { w: "100%" } } as any,
        presets: { horizontal: { w: "100%" } },
      };
      const result = callBases("Divider", config);
      const widthCount = (result.match(/width:/g) ?? []).length;
      expect(widthCount).toBe(1);
    });

    it("acumula keys únicas de flat base y variante nombrada", () => {
      const config: TestConfig = {
        variants: {
          bg: "neutral.50",
          Filled: { rounded: "lg" },
        } as any,
      };
      const result = callBases("Card", config);
      expect(result).toContain("background:var(--card-background,unset);");
      expect(result).toContain("border-radius:var(--card-border-radius,unset);");
    });

    it("acumula keys de estados en raíz y dentro de variantes", () => {
      const config: TestConfig = {
        variants: {
          hover: { shadow: "0 4px 6px rgba(0,0,0,0.08)" },
          Outlined: { hover: { borderColor: "primary.400" } },
        } as any,
      };
      const result = callBases("Card", config);
      expect(result).toContain("box-shadow:var(--card-box-shadow,unset);");
      expect(result).toContain("border-color:var(--card-border-color,unset);");
    });
  });
});
