import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentSizes } from "./generateSizes";

const p = defaultTheme.cssVarPrefix;

// Partial — estos fixtures aíslan un solo generador a la vez, sin necesidad de `sizes`.
type TestConfig = Partial<NonNullable<Theme["components"]>[string]>;

// --- generateComponentSizes --------------------------------------------------

describe("generateComponentSizes", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vac�o si no hay sizes", () => {
      const config: TestConfig = {};
      expect(generateComponentSizes("Card", config, defaultTheme)).toBe("");
    });

    it("retorna vac�o si sizes es objeto vac�o", () => {
      const config: TestConfig = { sizes: {} };
      expect(generateComponentSizes("Card", config, defaultTheme)).toBe("");
    });

    it("omite sizes con tokens vac�os", () => {
      const config: TestConfig = {
        sizes: { sm: {}, md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).not.toContain(`[data-size="sm"]`);
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("selector est�tico", () => {
    it("genera selector [data-slot][data-size] para el tama�o est�tico", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-size="md"]`);
    });

    it("resuelve token de spacing en size a CSS var", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de color en size a CSS var", () => {
      const config: TestConfig = {
        sizes: { md: { bg: "primary.50" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-primary-50);`);
    });

    it("pasa valor arbitrario sin transformar", () => {
      const config: TestConfig = {
        sizes: { md: { w: "240px" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      expect(result).toContain(`--card-width:240px;`);
    });
  });

  describe("selectores responsive (media queries)", () => {
    it("genera un @media query por cada breakpoint del tema", () => {
      const config: TestConfig = {
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
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const mediaQueryCount = (result.match(/@media\(min-width:/g) ?? []).length;
      expect(mediaQueryCount).toBe(bpCount);
    });

    it("el selector dentro del @media usa [data-size-{bp}] no [data-size]", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, defaultTheme);
      // El @media no debe contener el selector est�tico [data-size="md"]
      const mediaMatch = result.match(/@media\(min-width:[^)]+\)\{([^}]+)\}/g)?.[0] ?? "";
      expect(mediaMatch).not.toContain(`[data-size="md"]`);
      expect(mediaMatch).toContain(`[data-size-`);
    });

    it("incluye breakpoints agregados por el consumer", () => {
      const theme: Theme = {
        ...defaultTheme,
        breakpoints: { ...defaultTheme.breakpoints, "2xl": "1536px" } as Theme["breakpoints"],
      };
      const config: TestConfig = {
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
        sizes: { md: { p: "md" } },
      };
      const result = generateComponentSizes("Card", config, theme);
      expect(result).not.toContain("@media");
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("m�ltiples sizes", () => {
    it("genera bloques independientes para cada size", () => {
      const config: TestConfig = {
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

    it("cada size genera exactamente 1 bloque est�tico + N breakpoints media queries", () => {
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const config: TestConfig = {
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

// --- DSL $prop en sizes -------------------------------------------------------

describe("generateComponentSizes � DSL $prop", () => {
  it("$prop standalone en size resuelve var del padre", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      sizes: { md: { gap: "$gap" } },
    };
    const result = generateComponentSizes("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-slots-gap:var(--card-gap);`);
  });

  it("$prop inline en size resuelve var del padre dentro del valor", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      sizes: { md: { rounded: "0 0 $rounded $rounded" } },
    };
    const result = generateComponentSizes("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-slots-border-radius:0 0 var(--card-border-radius) var(--card-border-radius);`);
  });

  it("$prop en size tambi�n se repite en media queries responsive", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      sizes: { md: { gap: "$gap" } },
    };
    const result = generateComponentSizes("CardSection", config, defaultTheme);
    const mediaBlocks = result.match(/@media\([^)]+\)\{[^}]+\}/g) ?? [];
    expect(mediaBlocks.length).toBeGreaterThan(0);
    expect(mediaBlocks[0]).toContain(`var(--card-gap)`);
  });

  it("sin parentName, $prop apunta al propio prefix (auto-referencia)", () => {
    const config: TestConfig = {
      sizes: { md: { gap: "$gap" } },
    };
    const result = generateComponentSizes("Card", config, defaultTheme);
    expect(result).toContain(`--card-gap:var(--card-gap);`);
  });
});
