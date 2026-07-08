import { describe, expect, it, vi } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentSlots } from "./generateSlots";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentSlots ──────────────────────────────────────────────────

describe("generateComponentSlots", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay slots", () => {
      const config: TestConfig = { prefix: "card-section", prefixParent: "card" };
      expect(generateComponentSlots("CardSection", config, defaultTheme)).toBe("");
    });

    it("retorna vacío si slots es objeto vacío", () => {
      const config: TestConfig = { prefix: "card-section", prefixParent: "card", slots: {} };
      expect(generateComponentSlots("CardSection", config, defaultTheme)).toBe("");
    });

    it("omite slots con tokens vacíos", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: {
          header: {},
          body: { bg: "neutral.100" },
        },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).not.toContain(`data-section="header"`);
      expect(result).toContain(`data-section="body"`);
    });
  });

  describe("derivación de slotProp desde prefixParent", () => {
    it("deriva 'section' de CardSection + prefixParent 'card'", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { bg: "neutral.50" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`[data-slot="CardSection"][data-section="header"]`);
    });

    it("deriva 'panel' de TabsPanel + prefixParent 'tabs'", () => {
      const config: TestConfig = {
        prefix: "tabs-panel",
        prefixParent: "tabs",
        slots: { content: { p: "md" } },
      };
      const result = generateComponentSlots("TabsPanel", config, defaultTheme);
      expect(result).toContain(`[data-slot="TabsPanel"][data-panel="content"]`);
    });

    it("deriva 'item' de AccordionItem + prefixParent 'accordion'", () => {
      const config: TestConfig = {
        prefix: "accordion-item",
        prefixParent: "accordion",
        slots: { trigger: { fontWeight: "600" } },
      };
      const result = generateComponentSlots("AccordionItem", config, defaultTheme);
      expect(result).toContain(`[data-slot="AccordionItem"][data-item="trigger"]`);
    });

    it("usa 'section' como fallback si no hay prefixParent", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { header: { bg: "neutral.50" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-section="header"]`);
    });
  });

  describe("vars propias del hijo (prefix independiente)", () => {
    it("usa prefix del hijo para crear sus vars, no el del padre", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { bg: "neutral.50" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-background:`);
      expect(result).not.toContain(`--card-background:`);
    });

    it("resuelve token de color con prefix del hijo", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { bg: "neutral.100" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-background:var(--${p}-color-neutral-100);`);
    });

    it("resuelve token de spacing con prefix del hijo", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { body: { p: "md" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-padding:var(--${p}-spacing-md);`);
    });
  });

  describe("vars del padre en valores raw", () => {
    it("pasa var del padre sin transformar como raw string", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { borderBottom: "1px solid var(--card-border-color)" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-border-bottom:1px solid var(--card-border-color);`);
    });

    it("pasa valor raw sin token sin transformar", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { media: { overflow: "hidden" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-overflow:hidden;`);
    });
  });

  describe("DSL $prop — herencia de vars del padre", () => {
    it("forma standalone: $prop resuelve a var del padre", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { borderColor: "$borderColor" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-border-color:var(--card-border-color);`);
    });

    it("forma inline: $prop dentro de valor compuesto", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { borderBottom: "1px solid $borderColor" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-border-bottom:1px solid var(--card-border-color);`);
    });

    it("múltiples $prop en el mismo valor", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { boxShadow: "inset 0 0 0 1px $borderColor" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-box-shadow:inset 0 0 0 1px var(--card-border-color);`);
    });

    it("$prop con alias del padre (bg → background)", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { body: { background: "$bg" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-background:var(--card-background);`);
    });

    it("$prop en hijo con prefixParent multi-word", () => {
      const config: TestConfig = {
        prefix: "tabs-panel",
        prefixParent: "tabs",
        slots: { content: { borderColor: "$borderColor" } },
      };
      const result = generateComponentSlots("TabsPanel", config, defaultTheme);
      expect(result).toContain(`--tabs-panel-border-color:var(--tabs-border-color);`);
    });

    it("sin prefixParent, $prop apunta al propio prefix (auto-referencia)", () => {
      const config: TestConfig = {
        prefix: "card",
        slots: { header: { borderColor: "$borderColor" } },
      };
      const result = generateComponentSlots("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-color:var(--card-border-color);`);
    });

    it("$prop no interfiere con tokens normales en el mismo slot", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: {
          header: {
            bg: "neutral.50",          // token normal → var del tema
            borderColor: "$borderColor", // $prop → var del padre
          },
        },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-background:var(--${p}-color-neutral-50);`);
      expect(result).toContain(`--card-section-border-color:var(--card-border-color);`);
    });
  });

  describe("selector completo", () => {
    it("genera el bloque CSS completo con selector y token", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { bg: "neutral.50" } },
      };
      expect(generateComponentSlots("CardSection", config, defaultTheme)).toBe(
        `[data-slot="CardSection"][data-section="header"]{--card-section-background:var(--${p}-color-neutral-50);}`,
      );
    });

    it("genera bloques independientes para múltiples slots", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: {
          header: { bg: "neutral.50" },
          footer: { bg: "neutral.100" },
        },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`data-section="header"`);
      expect(result).toContain(`data-section="footer"`);
    });

    it("genera múltiples tokens dentro del mismo slot", () => {
      const config: TestConfig = {
        prefix: "card-section",
        prefixParent: "card",
        slots: { header: { bg: "neutral.50", rounded: "md" } },
      };
      const result = generateComponentSlots("CardSection", config, defaultTheme);
      expect(result).toContain(`--card-section-background:var(--${p}-color-neutral-50);`);
      expect(result).toContain(`--card-section-border-radius:var(--${p}-radius-md);`);
    });
  });
});
