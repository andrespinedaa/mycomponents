import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentSizes, generateSizes } from "./generateSizes";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentSizes ──────────────────────────────────────────────────

describe("generateComponentSizes", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay sizes", () => {
      const config: TestConfig = { prefix: "card" };
      expect(generateComponentSizes("Card", config, defaultTheme)).toBe("");
    });

    it("retorna vacío si sizes es objeto vacío", () => {
      const config: TestConfig = { prefix: "card", sizes: {} };
      expect(generateComponentSizes("Card", config, defaultTheme)).toBe("");
    });

    it("omite sizes con tokens vacíos", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { sm: {}, md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).not.toContain(`[data-size="sm"]`);
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("selector estático", () => {
    it("genera selector [data-slot][data-size] para el tamaño estático", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-size="md"]`);
    });

    it("resuelve token de spacing en size a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de color en size a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { bg: "primary.50" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-primary-50);`);
    });

    it("pasa valor arbitrario sin transformar", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { w: "240px" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-width:240px;`);
    });
  });

  describe("selectores responsive (media queries)", () => {
    it("genera un @media query por cada breakpoint del tema", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      for (const [bp, bpValue] of Object.entries(defaultTheme.breakpoints)) {
        expect(result).toContain(`@media(min-width:${bpValue})`);
        expect(result).toContain(`[data-size-${bp}="md"]`);
      }
    });

    it("cada breakpoint genera un bloque independiente con el mismo body de tokens", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const mediaQueryCount = (result.match(/@media\(min-width:/g) ?? []).length;
      expect(mediaQueryCount).toBe(bpCount);
    });

    it("el selector dentro del @media usa [data-size-{bp}] no [data-size]", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      // El @media no debe contener el selector estático [data-size="md"]
      const mediaMatch = result.match(/@media\(min-width:[^)]+\)\{([^}]+)\}/g)?.[0] ?? "";
      expect(mediaMatch).not.toContain(`[data-size="md"]`);
      expect(mediaMatch).toContain(`[data-size-`);
    });

    it("incluye breakpoints agregados por el consumer", () => {
      const theme: Theme = {
        ...defaultTheme,
        breakpoints: { ...defaultTheme.breakpoints, "2xl": "1536px" },
      };
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, theme);
      expect(result).toContain(`@media(min-width:1536px)`);
      expect(result).toContain(`[data-size-2xl="md"]`);
    });

    it("no genera media queries si el tema no tiene breakpoints", () => {
      const theme: Theme = {
        ...defaultTheme,
        breakpoints: {} as Theme["breakpoints"],
      };
      const config: TestConfig = {
        prefix: "card",
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, theme);
      expect(result).not.toContain("@media");
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("múltiples sizes", () => {
    it("genera bloques independientes para cada size", () => {
      const config: TestConfig = {
        prefix: "card",
        sizes: {
          sm: { p: "sm" },
          md: { p: "md" },
          lg: { p: "lg" },
        },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`[data-size="sm"]`);
      expect(result).toContain(`[data-size="md"]`);
      expect(result).toContain(`[data-size="lg"]`);
    });

    it("cada size genera exactamente 1 bloque estático + N breakpoints media queries", () => {
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const config: TestConfig = {
        prefix: "card",
        sizes: { sm: { p: "sm" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      const staticCount = (result.match(/\[data-size="sm"\]/g) ?? []).length;
      const responsiveCount = (result.match(/\[data-size-[a-z0-9]+="sm"\]/g) ?? []).length;
      expect(staticCount).toBe(1);
      expect(responsiveCount).toBe(bpCount);
    });
  });
});

// ─── generateSizes ───────────────────────────────────────────────────────────

describe("generateSizes", () => {
  it("retorna vacío si components es objeto vacío", () => {
    const theme: Theme = { ...defaultTheme, components: {} as Theme["components"] };
    expect(generateSizes(theme)).toBe("");
  });

  it("procesa múltiples componentes independientemente", () => {
    const theme: Theme = {
      ...defaultTheme,
      components: {
        Card: {
          prefix: "card",
          sizes: { md: { p: "md" } },
        },
        Badge: {
          prefix: "badge",
          sizes: { sm: { p: "sm" } },
        },
      } as Theme["components"],
    };
    const result = generateSizes(theme);
    expect(result).toContain(`[data-slot="Card"][data-size="md"]`);
    expect(result).toContain(`[data-slot="Badge"][data-size="sm"]`);
  });
});
