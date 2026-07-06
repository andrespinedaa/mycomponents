import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponents } from "./generateComponents";

const p = defaultTheme.cssVarPrefix;

// ─── generateComponents ──────────────────────────────────────────────────────

describe("generateComponents", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si components es objeto vacío", () => {
      const theme: Theme = { ...defaultTheme, components: {} as Theme["components"] };
      expect(generateComponents(theme)).toBe("");
    });

    it("retorna vacío si el único componente no tiene config de tokens", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Empty: { prefix: "empty" },
        } as Theme["components"],
      };
      expect(generateComponents(theme)).toBe("");
    });
  });

  describe("salida por sección", () => {
    it("incluye CSS de bases en la salida", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      // Bases → selector sin calificador adicional + var CSS con ,unset
      expect(result).toContain(`[data-slot="Card"]{`);
      expect(result).toContain(`var(--card-background,unset)`);
    });

    it("incluye CSS de variants en la salida", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-variant="Default"]`);
      expect(result).toContain(`var(--${p}-color-neutral-50)`);
    });

    it("incluye CSS de sizes en la salida", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            sizes: { md: { p: "md" } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-size="md"]`);
      expect(result).toContain(`@media(min-width:`);
      expect(result).toContain(`var(--${p}-spacing-md)`);
    });

    it("incluye CSS de slots en la salida", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            slots: { Section: { borderTop: "1px solid" } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-section="Section"]`);
      expect(result).toContain(`--card-border-top:1px solid`);
    });
  });

  describe("orden de secciones", () => {
    it("genera en orden: bases → variants → sizes → slots por componente", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            variants: { Default: { base: { bg: "neutral.50" } } },
            sizes: { md: { p: "md" } },
            slots: { Section: { borderTop: "1px solid" } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);

      // Bases: [data-slot="Card"]{ (sin calificador extra)
      const basesIdx = result.indexOf(`[data-slot="Card"]{`);
      // Variants: [data-slot="Card"][data-variant=
      const variantsIdx = result.indexOf(`[data-variant=`);
      // Sizes: [data-slot="Card"][data-size=
      const sizesIdx = result.indexOf(`[data-size=`);
      // Slots: [data-slot="Card"][data-section=
      const slotsIdx = result.indexOf(`[data-section=`);

      expect(basesIdx).toBeGreaterThanOrEqual(0);
      expect(variantsIdx).toBeGreaterThan(basesIdx);
      expect(sizesIdx).toBeGreaterThan(variantsIdx);
      expect(slotsIdx).toBeGreaterThan(sizesIdx);
    });
  });

  describe("múltiples componentes", () => {
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
            variants: { Filled: { base: { bg: "primary.500" } } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-slot="Card"]`);
      expect(result).toContain(`[data-slot="Badge"]`);
      expect(result).toContain(`--card-background:`);
      expect(result).toContain(`--badge-background:`);
    });

    it("las CSS vars de componentes distintos no colisionan", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            prefix: "card",
            sizes: { md: { p: "md" } },
          },
          Badge: {
            prefix: "badge",
            sizes: { md: { p: "sm" } },
          },
        } as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
      expect(result).toContain(`--badge-padding:var(--${p}-spacing-sm);`);
    });

    it("omite componentes sin tokens configurados y procesa los que sí tienen", () => {
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
      const result = generateComponents(theme);
      expect(result).not.toContain(`[data-slot="Empty"]`);
      expect(result).toContain(`[data-slot="Card"]`);
    });
  });
});
