import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentSlots } from "./generateSlots";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentSlots ──────────────────────────────────────────────────

describe("generateComponentSlots", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay slots", () => {
      const config: TestConfig = { prefix: "card" };
      expect(generateComponentSlots("Card", config, defaultTheme)).toBe("");
    });

    it("retorna vacío si slots es objeto vacío", () => {
      const config: TestConfig = { prefix: "card", slots: {} };
      expect(generateComponentSlots("Card", config, defaultTheme)).toBe("");
    });

    it("omite slots con tokens vacíos", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: {
          Header: {},
          Section: { bg: "neutral.100" },
        },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).not.toContain(`data-section="Header"`);
      expect(result).toContain(`data-section="Section"`);
    });
  });

  describe("slotProp", () => {
    it("usa 'section' como slotProp por defecto", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { bg: "neutral.100" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-section="Section"]`);
    });

    it("usa config.slotProp personalizado en lugar de 'section'", () => {
      const config: TestConfig = {
        prefix: "card",
        slotProp: "type",
        slots: { Header: { bg: "neutral.50" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-type="Header"]`);
      expect(result).not.toContain("data-section");
    });

    it("preserva el valor del slot en el atributo data-*", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { "hero-image": { rounded: "lg" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`data-section="hero-image"`);
    });
  });

  describe("resolución de tokens", () => {
    it("resuelve token de color a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { bg: "neutral.100" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-neutral-100);`);
    });

    it("resuelve token de spacing a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { p: "md" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("pasa valor raw sin transformar", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { borderTop: "1px solid" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-top:1px solid;`);
    });
  });

  describe("selector completo", () => {
    it("genera el bloque CSS completo con selector y tokens", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { bg: "neutral.50" } },
      };
      expect(generateComponentSlots("Card", config, defaultTheme)).toBe(
        `[data-slot="Card"][data-section="Section"]{--card-background:var(--${p}-color-neutral-50);}`,
      );
    });

    it("genera bloques independientes para múltiples slots", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: {
          Header: { bg: "neutral.50" },
          Footer: { bg: "neutral.100" },
        },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`data-section="Header"`);
      expect(result).toContain(`data-section="Footer"`);
    });

    it("genera múltiples tokens dentro del mismo slot", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { Section: { bg: "neutral.50", rounded: "md" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-neutral-50);`);
      expect(result).toContain(`--card-border-radius:var(--${p}-radius-md);`);
    });
  });
});
