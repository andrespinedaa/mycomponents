import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentVariants } from "./generateVariants";

const p = defaultTheme.cssVarPrefix;

// Partial — estos fixtures aíslan un solo generador a la vez, sin necesidad de `sizes`.
type TestConfig = Partial<NonNullable<Theme["components"]>[string]>;

// --- generateComponentVariants -----------------------------------------------

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

    it("omite variante con objeto vacío — no genera regla para ella", () => {
      const config: TestConfig = {
        variants: { Filled: {} },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toBe("");
    });

    it("omite estado con tokens vacíos — no genera regla para ese estado", () => {
      const config: TestConfig = {
        variants: { hover: { bg: "neutral.100" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      // no hay flat tokens → no genera `[data-slot="Card"]{`
      expect(result).not.toContain(`[data-slot="Card"]{`);
      expect(result).toContain(`[data-slot="Card"]:hover{`);
    });
  });

  describe("tokens planos en la raíz de variants (base sin variante)", () => {
    it("genera [data-slot='X'] sin [data-variant]", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]{`);
      expect(result).not.toContain(`data-variant`);
    });

    it("no genera :hover ni :focus cuando solo hay tokens planos", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).not.toContain(":hover");
      expect(result).not.toContain(":focus");
    });
  });

  describe("estados en la raíz de variants", () => {
    it("hover → [data-slot='X']:hover", () => {
      const config: TestConfig = {
        variants: { hover: { bg: "neutral.100" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]:hover{`);
    });

    it("focus → [data-slot='X']:focus-visible", () => {
      const config: TestConfig = {
        variants: { focus: { bg: "neutral.100" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]:focus-visible{`);
    });

    it("focusWithin → [data-slot='X']:focus-within", () => {
      const config: TestConfig = {
        variants: { focusWithin: { borderColor: "primary.500" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]:focus-within{`);
    });

    it("active → [data-slot='X']:active", () => {
      const config: TestConfig = {
        variants: { active: { bg: "neutral.200" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]:active{`);
    });

    it("disabled → [data-slot='X'][data-disabled]", () => {
      const config: TestConfig = {
        variants: { disabled: { bg: "neutral.200" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-disabled]{`);
    });

    it("invalid → [data-slot='X'][data-invalid]", () => {
      const config: TestConfig = {
        variants: { invalid: { borderColor: "danger.500" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-invalid]{`);
    });

    it("loading → [data-slot='X'][data-loading]", () => {
      const config: TestConfig = {
        variants: { loading: { bg: "neutral.100" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-loading]{`);
    });

    it("selected → [data-slot='X'][data-selected]", () => {
      const config: TestConfig = {
        variants: { selected: { bg: "primary.100" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-selected]{`);
    });

    it("before → [data-slot='X']::before", () => {
      const config: TestConfig = {
        variants: { before: { content: '""' } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]::before{`);
    });

    it("placeholder → [data-slot='X']::placeholder", () => {
      const config: TestConfig = {
        variants: { placeholder: { color: "neutral.400" } } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]::placeholder{`);
    });
  });

  describe("variantes nombradas", () => {
    it("variante genera [data-slot='X'][data-variant='Y']", () => {
      const config: TestConfig = {
        variants: {
          Filled: { bg: "primary.500", color: "neutral.50" },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Filled"]{`);
    });

    it("estado dentro de variante genera selector combinado", () => {
      const config: TestConfig = {
        variants: {
          Filled: {
            bg: "primary.500",
            hover: { bg: "primary.600" },
          },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Filled"]{`);
      expect(result).toContain(`[data-slot="Card"][data-variant="Filled"]:hover{`);
    });

    it("genera bloques independientes para múltiples variantes nombradas", () => {
      const config: TestConfig = {
        variants: {
          Filled:   { bg: "primary.50" },
          Outlined: { border: "1px solid" },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-variant="Filled"]`);
      expect(result).toContain(`[data-variant="Outlined"]`);
    });

    it("flat base + variante nombrada coexisten correctamente", () => {
      const config: TestConfig = {
        variants: {
          bg: "neutral.50",
          hover: { boxShadow: "0 4px 6px rgba(0,0,0,0.08)" },
          Outlined: {
            boxShadow: "none",
            hover: { borderColor: "primary.400" },
          },
        } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]{`);
      expect(result).toContain(`[data-slot="Card"]:hover{`);
      expect(result).toContain(`[data-slot="Card"][data-variant="Outlined"]{`);
      expect(result).toContain(`[data-slot="Card"][data-variant="Outlined"]:hover{`);
    });
  });

  describe("nesting de estados (2 niveles — SCSS-like)", () => {
    it("estado anidado dentro de estado genera selector combinado", () => {
      const config: TestConfig = {
        variants: {
          focusWithin: {
            borderColor: "primary.500",
            disabled: { borderColor: "neutral.300" } as any,
          },
        } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"]:focus-within{`);
      expect(result).toContain(`[data-slot="Card"]:focus-within[data-disabled]{`);
    });

    it("estado anidado dentro de variante genera selector de 3 partes", () => {
      const config: TestConfig = {
        variants: {
          Filled: {
            bg: "primary.500",
            hover: {
              bg: "primary.600",
              disabled: { bg: "primary.300" } as any,
            },
          },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`[data-slot="Card"][data-variant="Filled"]:hover{`);
      expect(result).toContain(`[data-slot="Card"][data-variant="Filled"]:hover[data-disabled]{`);
    });
  });

  describe("resolución de tokens", () => {
    it("resuelve token de color a CSS var (flat base)", () => {
      const config: TestConfig = {
        variants: { bg: "neutral.50" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-background:var(--${p}-color-neutral-50);`);
    });

    it("resuelve token de spacing a CSS var", () => {
      const config: TestConfig = {
        variants: { p: "md" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-padding:var(--${p}-spacing-md);`);
    });

    it("resuelve token de radius a CSS var", () => {
      const config: TestConfig = {
        variants: { rounded: "lg" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-radius:var(--${p}-radius-lg);`);
    });

    it("pasa valor raw sin transformar", () => {
      const config: TestConfig = {
        variants: { border: "1px solid" } as any,
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border:1px solid;`);
    });

    it("resuelve token de color para estado hover dentro de variante", () => {
      const config: TestConfig = {
        variants: {
          Outlined: { hover: { borderColor: "primary.400" } },
        },
      };
      const result = generateComponentVariants("Card", config, defaultTheme);
      expect(result).toContain(`--card-border-color:var(--${p}-color-primary-400);`);
    });
  });

  describe("prefix derivado de componentName", () => {
    it("deriva el prefix de camelToKebab(componentName)", () => {
      const config: TestConfig = {
        variants: { bg: "primary.500" } as any,
      };
      const result = generateComponentVariants("Button", config, defaultTheme);
      expect(result).toContain(`--button-background:`);
    });

    it("convierte camelCase a kebab-case correctamente", () => {
      const config: TestConfig = {
        variants: { bg: "primary.500" } as any,
      };
      const result = generateComponentVariants("myButton", config, defaultTheme);
      expect(result).toContain(`--my-button-background:`);
    });
  });
});

// --- DSL $prop en variants ----------------------------------------------------

describe("generateComponentVariants — DSL $prop", () => {
  it("$prop en flat base resuelve var del padre", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      variants: { color: "$color" } as any,
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-slots-color:var(--card-color);`);
  });

  it("$prop inline en variante nombrada resuelve dentro del valor", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      variants: { Filled: { outline: "2px solid $borderColor" } },
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-slots-outline:2px solid var(--card-border-color);`);
  });

  it("$prop en estado hover a nivel raíz", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      variants: { hover: { bg: "$background" } } as any,
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`:hover`);
    expect(result).toContain(`--card-slots-background:var(--card-background);`);
  });

  it("$prop coexiste con tokens normales en flat base", () => {
    const config: TestConfig = {
      parentName: "Card",
      componentName: "CardSection",
      variants: {
        bg: "neutral.50",
        color: "$color",
      } as any,
    };
    const result = generateComponentVariants("CardSection", config, defaultTheme);
    expect(result).toContain(`--card-slots-background:var(--${p}-color-neutral-50);`);
    expect(result).toContain(`--card-slots-color:var(--card-color);`);
  });

  it("sin parentName, $prop apunta al propio prefix (auto-referencia)", () => {
    const config: TestConfig = {
      variants: { color: "$color" } as any,
    };
    const result = generateComponentVariants("Card", config, defaultTheme);
    expect(result).toContain(`--card-color:var(--card-color);`);
  });
});
