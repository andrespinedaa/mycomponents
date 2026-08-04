import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateTokens } from "./generateTokens";
import { parseComponentConfig } from "./parseComponentConfig";
import { generateComponentSizes } from "./generateSizes";
import { resolveGeneratorNames } from "./generateComponents";
import type { GeneratorConfig } from "./css-gen-utils";
import type { ComponentName } from "../core";

const p = defaultTheme.prefix;
const { vars: tokenVars } = generateTokens(defaultTheme);

// Partial — estos fixtures aíslan un solo generador a la vez, sin necesidad de `sizes`.
// sizes se sobreescribe suelto: Record<Config["sizes"], ...> exige TODAS las keys de tamaño
// de TODOS los componentes cuando Config es la unión ComponentName — inmanejable en fixtures.
type TestConfig = Omit<Partial<NonNullable<Theme["components"]>[ComponentName]>, "sizes"> & {
  sizes?: Record<string, any>;
  name?: string;
  parentName?: string;
};

function callSizes(name: string, config: TestConfig, theme: Theme = defaultTheme): string {
  return generateComponentSizes(
    resolveGeneratorNames(name, config as GeneratorConfig),
    parseComponentConfig(config as GeneratorConfig).sizes,
    theme,
    tokenVars,
  );
}

// --- generateComponentSizes --------------------------------------------------

describe("generateComponentSizes", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay sizes", () => {
      const config: TestConfig = {};
      expect(callSizes("Card", config)).toBe("");
    });

    it("retorna vacío si sizes es objeto vacío", () => {
      const config: TestConfig = { sizes: {} };
      expect(callSizes("Card", config)).toBe("");
    });

    it("omite sizes con tokens vacíos", () => {
      const config: TestConfig = {
        sizes: { sm: {}, md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      expect(result).not.toContain(`[data-size="sm"]`);
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("selector estático", () => {
    it("genera selector [data-slot][data-size] para el tamaño estático", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      expect(result).toContain(`[data-slot="Card"][data-size="md"]`);
    });

    it("resuelve token de spacing en size a CSS var", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de color en size a CSS var", () => {
      const config: TestConfig = {
        sizes: { md: { bg: "primary.50" } },
      };
      const result = callSizes("Card", config);
      expect(result).toContain(`--card-background:var(--${p}-colors-primary-50);`);
    });

    it("pasa valor arbitrario sin transformar", () => {
      const config: TestConfig = {
        sizes: { md: { w: "240px" } },
      };
      const result = callSizes("Card", config);
      expect(result).toContain(`--card-width:240px;`);
    });
  });

  describe("selectores responsive (media queries)", () => {
    it("genera un @media query por cada breakpoint del tema", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      for (const [bp, bpValue] of Object.entries(defaultTheme.breakpoints)) {
        expect(result).toContain(`@media(min-width:${bpValue})`);
        expect(result).toContain(`[data-size-${bp}="md"]`);
      }
    });

    it("cada breakpoint genera un bloque independiente con el mismo body de tokens", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const mediaQueryCount = (result.match(/@media\(min-width:/g) ?? []).length;
      expect(mediaQueryCount).toBe(bpCount);
    });

    it("el selector dentro del @media usa [data-size-{bp}] no [data-size]", () => {
      const config: TestConfig = {
        sizes: { md: { p: "md" } },
      };
      const result = callSizes("Card", config);
      // El @media no debe contener el selector estático [data-size="md"]
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
      const result = callSizes("Card", config, theme);
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
      const result = callSizes("Card", config, theme);
      expect(result).not.toContain("@media");
      expect(result).toContain(`[data-size="md"]`);
    });
  });

  describe("múltiples sizes", () => {
    it("genera bloques independientes para cada size", () => {
      const config: TestConfig = {
        sizes: {
          sm: { p: "sm" },
          md: { p: "md" },
          lg: { p: "lg" },
        },
      };
      const result = callSizes("Card", config);
      expect(result).toContain(`[data-size="sm"]`);
      expect(result).toContain(`[data-size="md"]`);
      expect(result).toContain(`[data-size="lg"]`);
    });

    it("cada size genera exactamente 1 bloque estático + N breakpoints media queries", () => {
      const bpCount = Object.keys(defaultTheme.breakpoints).length;
      const config: TestConfig = {
        sizes: { sm: { p: "sm" } },
      };
      const result = callSizes("Card", config);
      const staticCount = (result.match(/\[data-size="sm"\]/g) ?? []).length;
      const responsiveCount = (result.match(/\[data-size-[a-z0-9]+="sm"\]/g) ?? []).length;
      expect(staticCount).toBe(1);
      expect(responsiveCount).toBe(bpCount);
    });
  });
});

// --- DSL $prop en sizes -------------------------------------------------------

describe("generateComponentSizes — DSL $prop", () => {
  it("$prop standalone en size resuelve var del padre", () => {
    const config: TestConfig = {
      parentName: "Card",
      name: "CardSection",
      sizes: { md: { gap: "$gap" } },
    };
    const result = callSizes("CardSection", config);
    expect(result).toContain(`--card-section-gap:var(--card-gap);`);
  });

  it("$prop inline en size resuelve var del padre dentro del valor", () => {
    const config: TestConfig = {
      parentName: "Card",
      name: "CardSection",
      sizes: { md: { rounded: "0 0 $rounded $rounded" } },
    };
    const result = callSizes("CardSection", config);
    expect(result).toContain(`--card-section-border-radius:0 0 var(--card-border-radius) var(--card-border-radius);`);
  });

  it("$prop en size también se repite en media queries responsive", () => {
    const config: TestConfig = {
      parentName: "Card",
      name: "CardSection",
      sizes: { md: { gap: "$gap" } },
    };
    const result = callSizes("CardSection", config);
    const mediaBlocks = result.match(/@media\([^)]+\)\{[^}]+\}/g) ?? [];
    expect(mediaBlocks.length).toBeGreaterThan(0);
    expect(mediaBlocks[0]).toContain(`var(--card-gap)`);
  });

  it("sin parentName, $prop apunta al propio prefix (auto-referencia)", () => {
    const config: TestConfig = {
      sizes: { md: { gap: "$gap" } },
    };
    const result = callSizes("Card", config);
    expect(result).toContain(`--card-gap:var(--card-gap);`);
  });
});
