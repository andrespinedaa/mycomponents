import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateBases, generateComponentBases } from "./generateBases";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentBases ──────────────────────────────────────────────────

describe("generateComponentBases", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay variants, sizes ni slots", () => {
      const config: TestConfig = { prefix: "card" };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si variants existe pero todos los estados tienen tokens vacíos", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: {} } },
      };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si sizes existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { prefix: "card", sizes: { md: {} } };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("retorna vacío si slots existe pero todos los tokens están vacíos", () => {
      const config: TestConfig = { prefix: "card", slots: { Section: {} } };
      expect(generateComponentBases("Card", config)).toBe("");
    });
  });

  describe("prefix", () => {
    it("usa config.prefix si está definido", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentBases("Card", config);
      expect(result).toContain("var(--card-background,unset)");
    });

    it("usa camelToKebab(componentName) como fallback si no hay prefix", () => {
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
        prefix: "card",
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — rounded → border-radius", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { rounded: "lg" } } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{border-radius:var(--card-border-radius,unset);}`,
      );
    });

    it("resuelve alias a CSS prop correctamente — p → padding", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      expect(generateComponentBases("Card", config)).toBe(
        `[data-slot="Card"]{padding:var(--card-padding,unset);}`,
      );
    });

    it("slots con presets no contribuyen al base CSS (son inline styles)", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { header: { presets: { default: { borderTop: "1px solid" } } } },
      };
      expect(generateComponentBases("Card", config)).toBe("");
    });

    it("genera múltiples props en un solo selector", () => {
      const config: TestConfig = {
        prefix: "card",
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
        prefix: "card",
        variants: { Default: { base: { bg: "neutral.50" } } },
        sizes: { md: { bg: "primary.500" } },
      };
      const result = generateComponentBases("Card", config);
      // Solo un bloque de base selector
      expect(result).toBe(
        `[data-slot="Card"]{background:var(--card-background,unset);}`,
      );
    });

    it("deduplica keys que aparecen en variants, sizes y slots", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { p: "md" } } },
        sizes: { md: { p: "md" } },
        slots: { Section: { p: "sm" } },
      };
      const result = generateComponentBases("Card", config);
      const paddingCount = (result.match(/padding:/g) ?? []).length;
      expect(paddingCount).toBe(1);
    });

    it("acumula keys únicas de variantes múltiples", () => {
      const config: TestConfig = {
        prefix: "card",
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

// ─── generateBases ───────────────────────────────────────────────────────────

describe("generateBases", () => {
  it("retorna vacío si components es objeto vacío", () => {
    const theme: Theme = { ...defaultTheme, components: {} as Theme["components"] };
    expect(generateBases(theme)).toBe("");
  });

  it("procesa múltiples componentes independientemente", () => {
    const theme: Theme = {
      ...defaultTheme,
      components: {
        Card: {
          prefix: "card",
          variants: { Default: { base: { bg: "neutral.50" } } },
        },
        Badge: {
          prefix: "badge",
          sizes: { md: { p: "md" } },
        },
      } as Theme["components"],
    };
    const result = generateBases(theme);
    expect(result).toContain(`[data-slot="Card"]`);
    expect(result).toContain(`[data-slot="Badge"]`);
    expect(result).toContain("var(--card-background,unset)");
    expect(result).toContain("var(--badge-padding,unset)");
  });

  it("omite componentes sin tokens configurados", () => {
    const theme: Theme = {
      ...defaultTheme,
      components: {
        Empty: { prefix: "empty" },
        Card: {
          prefix: "card",
          variants: { Default: { base: { bg: "neutral.50" } } },
        },
      } as Theme["components"],
    };
    const result = generateBases(theme);
    expect(result).not.toContain(`[data-slot="Empty"]`);
    expect(result).toContain(`[data-slot="Card"]`);
  });
});
