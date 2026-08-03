import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateTokens } from "./generateTokens";
import { generateComponents } from "./generateComponents";

const p = defaultTheme.prefix;
const { vars: tokenVars } = generateTokens(defaultTheme);

// ─── generateComponents ──────────────────────────────────────────────────────

describe("generateComponents", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si components es objeto vacío", () => {
      const theme: Theme = { ...defaultTheme, components: {} as unknown as Theme["components"] };
      expect(generateComponents(theme, tokenVars)).toBe("");
    });

    it("retorna vacío si el único componente no tiene config de tokens", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Empty: {},
        } as unknown as Theme["components"],
      };
      expect(generateComponents(theme, tokenVars)).toBe("");
    });
  });

  describe("salida por sección", () => {
    it("incluye CSS de bases en la salida — selector con ,unset", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            variants: { bg: "neutral.50" },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`[data-slot="Card"]{`);
      expect(result).toContain(`var(--card-background,unset)`);
    });

    it("incluye CSS de variante nombrada en la salida", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            variants: { Filled: { bg: "neutral.50" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`[data-variant="Filled"]`);
      expect(result).toContain(`var(--${p}-colors-neutral-50)`);
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
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`[data-size="md"]`);
      expect(result).toContain(`@media(min-width:`);
      expect(result).toContain(`var(--${p}-spacing-md)`);
    });

    it("entrada con parentName genera CSS como componente top-level", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          CardSection: {
            name: "CardSection",
            parentName: "Card",
            sizes: { md: { p: "md" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`[data-slot="CardSection"]`);
      expect(result).toContain(`--card-section-padding`);
    });

    it("componente con parentName usa el prefix del padre en sus CSS vars", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {},
          CardSection: {
            name: "CardSection",
            parentName: "Card",
            sizes: { md: { p: "md" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`[data-slot="CardSection"]`);
      expect(result).not.toContain(`data-slot-parent`);
      expect(result).toContain(`--card-section-padding`);
    });
  });

  describe("orden de secciones", () => {
    it("genera en orden: bases → variants → sizes por componente", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Card: {
            variants: {
              bg: "neutral.50",
              Filled: { bg: "primary.50" },
            },
            sizes: { md: { p: "md" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);

      const basesIdx   = result.indexOf(`var(--card-background,unset)`);
      const variantsIdx = result.indexOf(`[data-variant=`);
      const sizesIdx   = result.indexOf(`[data-size=`);

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
            variants: { bg: "neutral.50" },
          },
          Badge: {
            variants: { Filled: { bg: "primary.500" } },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
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
      const result = generateComponents(theme, tokenVars);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
      expect(result).toContain(`--badge-padding:var(--${p}-spacing-sm);`);
    });

    it("omite componentes sin tokens configurados y procesa los que sí tienen", () => {
      const theme: Theme = {
        ...defaultTheme,
        components: {
          Empty: {},
          Card: {
            variants: { bg: "neutral.50" },
          },
        } as unknown as Theme["components"],
      };
      const result = generateComponents(theme, tokenVars);
      expect(result).not.toContain(`[data-slot="Empty"]`);
      expect(result).toContain(`[data-slot="Card"]`);
    });
  });
});
