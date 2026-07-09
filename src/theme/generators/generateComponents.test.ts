import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponents } from "./generateComponents";

const p = defaultTheme.cssVarPrefix;

// ─── generateComponents ──────────────────────────────────────────────────────

describe("generateComponents", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si components es objeto vacío", () => {
      const theme: Theme = { ...defaultTheme, components: {} as unknown as Theme["components"] };
      expect(generateComponents(theme)).toBe("");
    });

    it("retorna vacío si el único componente no tiene config de tokens", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Empty: {},
        } as unknown as Theme["components"],
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
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
        } as unknown as Theme["components"],
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
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
        } as unknown as Theme["components"],
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
            sizes: { md: { p: "md" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-size="md"]`);
      expect(result).toContain(`@media(min-width:`);
      expect(result).toContain(`var(--${p}-spacing-md)`);
    });

    it("slots con presets generan CSS con selector [data-section][data-preset]", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          CardSection: {
            slots: { header: { presets: { default: { borderBottom: "1px solid" } } } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`[data-slot="CardSection"][data-section="header"]`);
      expect(result).toContain(`--card-section-border-bottom:1px solid`);
    });
  });

  describe("orden de secciones", () => {
    it("genera en orden: bases → variants → sizes por componente", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            variants: { Default: { base: { bg: "neutral.50" } } },
            sizes: { md: { p: "md" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme);

      const basesIdx = result.indexOf(`[data-slot="Card"]{`);
      const variantsIdx = result.indexOf(`[data-variant=`);
      const sizesIdx = result.indexOf(`[data-size=`);

      expect(basesIdx).toBeGreaterThanOrEqual(0);
      expect(variantsIdx).toBeGreaterThan(basesIdx);
      expect(sizesIdx).toBeGreaterThan(variantsIdx);
    });
  });

  describe("múltiples componentes", () => {
    it("procesa múltiples componentes independientemente", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
          Badge: {
            variants: { Filled: { base: { bg: "primary.500" } } },
          },
        } as unknown as Theme["components"],
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
            sizes: { md: { p: "md" } },
          },
          Badge: {
            sizes: { md: { p: "sm" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
      expect(result).toContain(`--badge-padding:var(--${p}-spacing-sm);`);
    });

    it("omite componentes sin tokens configurados y procesa los que sí tienen", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Empty: {},
          Card: {
            variants: { Default: { base: { bg: "neutral.50" } } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme);
      expect(result).not.toContain(`[data-slot="Empty"]`);
      expect(result).toContain(`[data-slot="Card"]`);
    });
  });
});
