import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentVariants } from "./generateVariants";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentVariants ───────────────────────────────────────────────

describe("generateComponentVariants", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay variants", () => {
      const config: TestConfig = {};
      expect(generateComponentVariants("Card", config, defaultTheme)).toBe("");
    });

    it("retorna vacío si variants es objeto vacío", () => {
      const config: TestConfig = { variants: {} };
      expect(generateComponentVariants("Card", config, defaultTheme)).toBe("");
    });

    it("omite estados con tokens vacíos", () => {
      const config: TestConfig = {
        variants: { Default: { base: {}, hover: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      // base vacío → no genera bloque sin sufijo de estado
      expect(result).not.toContain(`[data-variant="Default"]{`);
      expect(result).toContain(`[data-variant="Default"]:hover{`);
    });
  });

  describe("selectores por estado", () => {
    it("genera selector sin sufijo para estado base", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]{`);
      expect(result).not.toContain(":hover");
      expect(result).not.toContain(":focus");
    });

    it("genera selector con :hover para estado hover", () => {
      const config: TestConfig = {
        variants: { Default: { hover: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:hover{`);
    });

    it("genera selector con :focus-visible para estado focus", () => {
      const config: TestConfig = {
        variants: { Default: { focus: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:focus-visible{`);
    });

    it("genera selector con :active para estado active", () => {
      const config: TestConfig = {
        variants: { Default: { active: { bg: "neutral.200" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:active{`);
    });

    it("genera selector con [data-disabled] para estado disabled", () => {
      const config: TestConfig = {
        variants: { Default: { disabled: { bg: "neutral.200" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-disabled]{`);
    });

    it("genera selector con [data-loading] para estado loading", () => {
      const config: TestConfig = {
        variants: { Default: { loading: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-loading]{`);
    });

    it("genera selector con [data-selected] para estado selected", () => {
      const config: TestConfig = {
        variants: { Default: { selected: { bg: "primary.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-selected]{`);
    });
  });

  describe("resolución de tokens", () => {
    it("resuelve token de color a CSS var", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-neutral-50);`);
    });

    it("resuelve token de spacing a CSS var", () => {
      const config: TestConfig = {
        variants: { Default: { base: { p: "md" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de radius a CSS var", () => {
      const config: TestConfig = {
        variants: { Default: { base: { rounded: "lg" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-radius:var(--${p}-radius-lg);`);
    });

    it("pasa valor raw sin transformar", () => {
      const config: TestConfig = {
        variants: { Default: { base: { border: "1px solid" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border:1px solid;`);
    });

    it("resuelve token de color para estado hover", () => {
      const config: TestConfig = {
        variants: { Default: { hover: { borderColor: "primary.400" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-color:var(--${p}-color-primary-400);`);
    });
  });

  describe("múltiples variantes y estados", () => {
    it("genera bloques independientes para múltiples variantes", () => {
      const config: TestConfig = {
        variants: {
          Default: { base: { bg: "neutral.50" } },
          Filled: { base: { bg: "primary.50" } },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-variant="Default"]`);
      expect(result).toContain(`[data-variant="Filled"]`);
    });

    it("genera bloques independientes para múltiples estados de una variante", () => {
      const config: TestConfig = {
        variants: {
          Default: {
            base: { bg: "neutral.50" },
            hover: { bg: "neutral.100" },
            disabled: { bg: "neutral.200" },
          },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-variant="Default"]{`);
      expect(result).toContain(`[data-variant="Default"]:hover{`);
      expect(result).toContain(`[data-variant="Default"][data-disabled]{`);
    });
  });

  describe("prefix derivado de componentName", () => {
    it("deriva el prefix de camelToKebab(componentName)", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "primary.500" } } },
      };
      const result = generateComponentVariants("Button", config, defaultTheme);
      expect(result).toContain(`--button-background:`);
    });

    it("convierte camelCase a kebab-case correctamente", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "primary.500" } } },
      };
      const result = generateComponentVariants("myButton", config, defaultTheme);
      expect(result).toContain(`--my-button-background:`);
    });
  });
});

// ─── DSL $prop en variants ────────────────────────────────────────────────────

describe("generateComponentVariants — DSL $prop", () => {
  it("$prop standalone en variant base resuelve var del padre", () => {
    const config: TestConfig = {
      prefixParentName: "card",
      variants: { Default: { base: { color: "$color" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-section-color:var(--card-color);`);
  });

  it("$prop inline en variant resuelve dentro del valor", () => {
    const config: TestConfig = {
      prefixParentName: "card",
      variants: { Filled: { base: { outline: "2px solid $borderColor" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-section-outline:2px solid var(--card-border-color);`);
  });

  it("$prop en estado hover de una variant", () => {
    const config: TestConfig = {
      prefixParentName: "card",
      variants: { Default: { hover: { bg: "$background" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`:hover`);
    expect(result).toContain(`--card-section-background:var(--card-background);`);
  });

  it("$prop coexiste con tokens normales en la misma variant", () => {
    const config: TestConfig = {
      prefixParentName: "card",
      variants: {
        Default: {
          base: {
            bg: "neutral.50",      // token normal
            color: "$color",       // $prop
          },
        },
      },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-section-background:var(--${p}-color-neutral-50);`);
    expect(result).toContain(`--card-section-color:var(--card-color);`);
  });

  it("sin prefixParentName, $prop apunta al propio prefix (auto-referencia)", () => {
    const config: TestConfig = {
      variants: { Default: { base: { color: "$color" } } },
    };
    const result = generateComponentVariants("Card", config, defaultTheme);
    expect(result).toContain(`--card-color:var(--card-color);`);
  });
});
