// src/hooks/useProps.test.ts
import { describe, it, expect } from "vitest";
import { useProps } from "./useProps";
import { defaultTheme } from "../themes/default-theme";
import type { SystemVariants } from "../theme";

// Tipos de prueba
type ButtonProps = {
  variant?: SystemVariants<"Outlined" | "Ghost">;
  size?: "sm" | "md" | "lg";
  dataSlot?: string;
};

describe("useProps", () => {
  // ─── Sin componentName ────────────────────────────────────────
  describe("sin componentName", () => {
    it("retorna las props sin modificar si no hay componentName", () => {
      const props: ButtonProps = { variant: "Outlined", size: "md" };
      const result = useProps(defaultTheme, props);
      expect(result).toEqual(props);
    });

    it("aplica configDefaults si no hay componentName", () => {
      const props: ButtonProps = { size: "md" };
      const result = useProps(defaultTheme, props, undefined, {
        variant: "Ghost",
      } as Partial<ButtonProps>);
      expect(result).toEqual({ variant: "Ghost", size: "md" });
    });
  });

  // ─── configDefaults ───────────────────────────────────────────
  describe("configDefaults", () => {
    it("aplica configDefaults como menor prioridad", () => {
      const props: ButtonProps = { variant: "Outlined" };
      const result = useProps(defaultTheme, props, undefined, {
        variant: "Outlined",
        size: "md",
      } as Partial<ButtonProps>);
      expect(result.variant).toBe("Outlined");
      expect(result.size).toBe("md");
    });

    it("configDefaults no pisa props del consumer", () => {
      const props: ButtonProps = { dataSlot: "custom" };
      const result = useProps(defaultTheme, props, undefined, {
        dataSlot: "Header",
      } as Partial<ButtonProps>);
      expect(result.dataSlot).toBe("custom");
    });

    it("configDefaults aplica dataSlot si consumer no lo pasa", () => {
      const props: ButtonProps = {};
      const result = useProps(defaultTheme, props, undefined, {
        dataSlot: "Header",
      } as Partial<ButtonProps>);
      expect(result.dataSlot).toBe("Header");
    });
  });

  // ─── themeDefaults ────────────────────────────────────────────
  describe("themeDefaults desde theme.components", () => {
    it("aplica themeDefaults del componente", () => {
      const props: ButtonProps = {};
      const result = useProps(defaultTheme, props, "Button");
      expect(result.variant).toBe("Filled");
    });

    it("themeDefaults ganan sobre configDefaults", () => {
      const props: ButtonProps = {};
      const result = useProps(defaultTheme, props, "Button", {
        variant: "Ghost",
      } as Partial<ButtonProps>);
      expect(result.variant).toBe("Filled");
    });

    it("consumer gana sobre themeDefaults", () => {
      const props: ButtonProps = { variant: "Outlined" };
      const result = useProps(defaultTheme, props, "Button");
      expect(result.variant).toBe("Outlined");
    });

    it("componente desconocido no aplica themeDefaults", () => {
      const props: ButtonProps = { variant: "Outlined" };
      const result = useProps(defaultTheme, props, "Unknown");
      expect(result).toEqual({ variant: "Outlined" });
    });
  });

  // ─── prioridad completa ───────────────────────────────────────
  describe("prioridad: configDefaults < themeDefaults < consumer", () => {
    it("orden correcto de merge", () => {
      const themeWithOverride = {
        ...defaultTheme,
        components: {
          ...defaultTheme.components,
          Button: {
            defaultProps: {
              variant: "Outlined" as const,
              size: "lg" as const,
            },
          },
        },
      };

      const props: ButtonProps = { size: "sm" };
      const result = useProps(themeWithOverride, props, "Button", {
        variant: "Ghost",
        size: "md",
      } as Partial<ButtonProps>);

      expect(result.variant).toBe("Outlined");
      expect(result.size).toBe("sm");
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("props vacías con configDefaults vacíos retorna objeto vacío", () => {
      const result = useProps(defaultTheme, {} as ButtonProps);
      expect(result).toEqual({});
    });

    it("preserva todas las props del consumer", () => {
      const props: ButtonProps = { variant: "Outlined", size: "lg" };
      const result = useProps(defaultTheme, props);
      expect(result).toEqual(props);
    });

    it("no muta el objeto props original", () => {
      const props: ButtonProps = { variant: "Outlined" };
      const original = { ...props };
      useProps(defaultTheme, props, undefined, {
        size: "md",
      } as Partial<ButtonProps>);
      expect(props).toEqual(original);
    });
  });
});
