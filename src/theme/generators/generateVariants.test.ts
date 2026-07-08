import { describe, expect, it, vi } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentVariants, generateVariants } from "./generateVariants";

const p = defaultTheme.cssVarPrefix;

type TestConfig = NonNullable<Theme["components"]>[string];

// ─── generateComponentVariants ───────────────────────────────────────────────

describe("generateComponentVariants", () => {
  describe("guarda de salida temprana", () => {
    it("retorna vacío si no hay variants", () => {
      const config: TestConfig = { prefix: "card" };
      expect(generateComponentVariants("Card", config, defaultTheme)).toBe("");
    });

    it("retorna vacío si variants es objeto vacío", () => {
      const config: TestConfig = { prefix: "card", variants: {} };
      expect(generateComponentVariants("Card", config, defaultTheme)).toBe("");
    });

    it("omite estados con tokens vacíos", () => {
      const config: TestConfig = {
        prefix: "card",
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
        prefix: "card",
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]{`);
      expect(result).not.toContain(":hover");
      expect(result).not.toContain(":focus");
    });

    it("genera selector con :hover para estado hover", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { hover: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:hover{`);
    });

    it("genera selector con :focus-visible para estado focus", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { focus: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:focus-visible{`);
    });

    it("genera selector con :active para estado active", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { active: { bg: "neutral.200" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"]:active{`);
    });

    it("genera selector con [data-disabled] para estado disabled", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { disabled: { bg: "neutral.200" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-disabled]{`);
    });

    it("genera selector con [data-loading] para estado loading", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { loading: { bg: "neutral.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-loading]{`);
    });

    it("genera selector con [data-selected] para estado selected", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { selected: { bg: "primary.100" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Default"][data-selected]{`);
    });
  });

  describe("resolución de tokens", () => {
    it("resuelve token de color a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { bg: "neutral.50" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-neutral-50);`);
    });

    it("resuelve token de spacing a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { p: "md" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de radius a CSS var", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { rounded: "lg" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-radius:var(--${p}-radius-lg);`);
    });

    it("pasa valor raw sin transformar", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { base: { border: "1px solid" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border:1px solid;`);
    });

    it("resuelve token de color para estado hover", () => {
      const config: TestConfig = {
        prefix: "card",
        variants: { Default: { hover: { borderColor: "primary.400" } } },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-color:var(--${p}-color-primary-400);`);
    });
  });

  describe("múltiples variantes y estados", () => {
    it("genera bloques independientes para múltiples variantes", () => {
      const config: TestConfig = {
        prefix: "card",
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
        prefix: "card",
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

  describe("prefix", () => {
    it("usa config.prefix para nombrar las CSS vars", () => {
      const config: TestConfig = {
        prefix: "btn",
        variants: { Default: { base: { bg: "primary.500" } } },
      };
      const result = generateComponentVariants("Button", config, defaultTheme);
      expect(result).toContain(`--btn-background:`);
      expect(result).not.toContain(`--button-background:`);
    });

    it("usa camelToKebab(componentName) como fallback si no hay prefix", () => {
      const config: TestConfig = {
        variants: { Default: { base: { bg: "primary.500" } } },
      };
      const result = generateComponentVariants("myButton", config, defaultTheme);
      expect(result).toContain(`--my-button-background:`);
    });
  });
});

// ─── generateVariants ────────────────────────────────────────────────────────

describe("generateVariants", () => {
  it("retorna vacío si components es objeto vacío", () => {
    const theme: Theme = { ...defaultTheme, components: {} as Theme["components"] };
    expect(generateVariants(theme)).toBe("");
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
          variants: { Filled: { base: { bg: "primary.500" } } },
        },
      } as Theme["components"],
    };
    const result = generateVariants(theme);
    expect(result).toContain(`[data-slot="Card"][data-variant="Default"]`);
    expect(result).toContain(`[data-slot="Badge"][data-variant="Filled"]`);
  });
});

// ─── DSL $prop en variants ────────────────────────────────────────────────────

describe("generateComponentVariants — DSL $prop", () => {
  it("$prop standalone en variant base resuelve var del padre", () => {
    const config: TestConfig = {
      prefix: "card-section",
      prefixParent: "card",
      variants: { Compact: { base: { color: "$color" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-section-color:var(--card-color);`);
  });

  it("$prop inline en variant resuelve dentro del valor", () => {
    const config: TestConfig = {
      prefix: "card-section",
      prefixParent: "card",
      variants: { Highlight: { base: { outline: "2px solid $borderColor" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-section-outline:2px solid var(--card-border-color);`);
  });

  it("$prop en estado hover de una variant", () => {
    const config: TestConfig = {
      prefix: "card-section",
      prefixParent: "card",
      variants: { Compact: { hover: { bg: "$background" } } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`:hover`);
    expect(result).toContain(`--card-section-background:var(--card-background);`);
  });

  it("$prop coexiste con tokens normales en la misma variant", () => {
    const config: TestConfig = {
      prefix: "card-section",
      prefixParent: "card",
      variants: {
        Compact: {
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

  it("sin prefixParent, $prop apunta al propio prefix (auto-referencia)", () => {
    const config: TestConfig = {
      prefix: "card",
      variants: { Default: { base: { color: "$color" } } },
    };
    const result = generateComponentVariants("Card", config, defaultTheme);
    expect(result).toContain(`--card-color:var(--card-color);`);
  });
});
