import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Box } from "../components/Primitives/Box/Box";
import { ThemeProvider, type SystemVariants } from "../theme";
import { defaultTheme } from "../theme/default-theme";
import { ComponentFactory } from "./ComponentFactory";
import type { ComponentConfig, EmptyStatics } from "./factories.types";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
);

// ─── Configs de prueba ────────────────────────────────────────
type TestConfig = ComponentConfig<{
  componentName: "Test";
  defaultTag: "button";
  ownProps: {
    variant?: SystemVariants<"Default" | "Outlined">;
    label?: string;
  };
  sizes: "sm" | "md" | "lg";
  statics: EmptyStatics;
  defaultProps: {
    variant: "Default";
  };
}>;

type NoRenderConfig = ComponentConfig<{
  componentName: "NoRender";
  defaultTag: "section";
  ownProps: {};
  statics: EmptyStatics;
  defaultProps: {};
}>;

type HookConfig = ComponentConfig<{
  componentName: "HookTest";
  defaultTag: "div";
  ownProps: { label?: string };
  statics: EmptyStatics;
  defaultProps: {};
  hooks: { count: number };
}>;

// ─── Componentes de prueba ────────────────────────────────────
const TestComponent = ComponentFactory<TestConfig>({
  defaultTag: "button",
  componentName: "Test",
  defaultProps: { variant: "Default" },
  render: ({ variant, children, ref, ...rest }) => (
    <Box as="button" ref={ref} mod={{ variant }} {...rest}>
      {children}
    </Box>
  ),
});

const NoRenderComponent = ComponentFactory<NoRenderConfig>({
  defaultTag: "section",
  componentName: "NoRender",
});

describe("ComponentFactory", () => {

  // ─── displayName ──────────────────────────────────────────────
  describe("displayName", () => {
    it("asigna displayName desde componentName", () => {
      expect(TestComponent.displayName).toBe("Test");
    });

    it("sin componentName no tiene displayName", () => {
      const NoName = ComponentFactory<TestConfig>({
        defaultTag: "button",
        render: ({ children, ref }) => <Box ref={ref}>{children}</Box>,
      });
      expect(NoName.displayName).toBeUndefined();
    });
  });

  // ─── renderizado con render ───────────────────────────────────
  describe("renderizado con render", () => {
    it("renderiza el componente correctamente", () => {
      render(<TestComponent>click</TestComponent>, { wrapper });
      expect(screen.getByText("click")).toBeInTheDocument();
    });

    it("pasa OwnProps al render", () => {
      render(<TestComponent variant="Outlined">btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveAttribute("data-variant", "Outlined");
    });

    it("aplica defaultProps cuando no se pasan OwnProps", () => {
      render(<TestComponent>btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveAttribute("data-variant", "Default");
    });

    it("pasa HTMLAttributes al elemento", () => {
      render(<TestComponent id="test-btn" aria-label="botón">btn</TestComponent>, { wrapper });
      const el = screen.getByText("btn");
      expect(el).toHaveAttribute("id", "test-btn");
      expect(el).toHaveAttribute("aria-label", "botón");
    });

    it("pasa onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TestComponent onClick={handleClick}>btn</TestComponent>, { wrapper });
      await user.click(screen.getByText("btn"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ─── fallback sin render ──────────────────────────────────────
  describe("sin render — fallback a Box", () => {
    it("renderiza el defaultTag cuando no hay render", () => {
      const { container } = render(<NoRenderComponent>contenido</NoRenderComponent>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("ref apunta al elemento DOM en el fallback", () => {
      const ref = createRef<HTMLElement>();
      render(<NoRenderComponent ref={ref}>contenido</NoRenderComponent>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.nodeName).toBe("SECTION");
    });

    it("pasa HTMLAttributes en el fallback", () => {
      const { container } = render(
        <NoRenderComponent id="no-render" aria-label="sin render">contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("id", "no-render");
      expect(container.firstChild).toHaveAttribute("aria-label", "sin render");
    });

    it("mod genera data attributes en el fallback", () => {
      const { container } = render(
        <NoRenderComponent mod={{ state: "active" }}>contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-state", "active");
    });
  });

  // ─── size ─────────────────────────────────────────────────────
  describe("size", () => {
    it("size estático genera data-size", () => {
      render(<TestComponent size="lg">btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveAttribute("data-size", "lg");
    });

    it("size responsive genera data-size y data-size-md", () => {
      render(<TestComponent size={{ base: "sm", md: "lg" }}>btn</TestComponent>, { wrapper });
      const el = screen.getByText("btn");
      expect(el).toHaveAttribute("data-size", "sm");
      expect(el).toHaveAttribute("data-size-md", "lg");
    });
  });

  // ─── variant ──────────────────────────────────────────────────
  describe("variant", () => {
    it("variant genera data-variant", () => {
      render(<TestComponent variant="Outlined">btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveAttribute("data-variant", "Outlined");
    });
  });

  // ─── componentName → data-slot ───────────────────────────────
  describe("data-slot", () => {
    it("componentName genera data-slot automático", () => {
      render(<TestComponent>btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveAttribute("data-slot", "Test");
    });
  });

  // ─── useHooks ─────────────────────────────────────────────────
  describe("useHooks", () => {
    it("hooks están disponibles en render", () => {
      let capturedCount: number | undefined;
      const HookComponent = ComponentFactory<HookConfig>({
        defaultTag: "div",
        componentName: "HookTest",
        useHooks: () => ({ count: 42 }),
        render: ({ hooks, ref, children, ...rest }) => {
          capturedCount = hooks.count;
          return <Box ref={ref} {...rest}>{children}</Box>;
        },
      });
      render(<HookComponent>x</HookComponent>, { wrapper });
      expect(capturedCount).toBe(42);
    });
  });

  // ─── theme en render ──────────────────────────────────────────
  describe("theme en render", () => {
    it("theme tiene el cssVarPrefix del tema activo", () => {
      let prefix: string | undefined;
      const ThemeComponent = ComponentFactory<NoRenderConfig>({
        defaultTag: "div",
        render: ({ theme, ref, children, ...rest }) => {
          prefix = theme.cssVarPrefix;
          return <Box ref={ref} {...rest}>{children}</Box>;
        },
      });
      render(<ThemeComponent>x</ThemeComponent>, { wrapper });
      expect(prefix).toBe(defaultTheme.cssVarPrefix);
    });
  });

  // ─── ref ──────────────────────────────────────────────────────
  describe("ref", () => {
    it("ref apunta al elemento DOM", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<TestComponent ref={ref}>btn</TestComponent>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ─── statics ──────────────────────────────────────────────────
  describe("statics", () => {
    const SubComponent = ComponentFactory<TestConfig>({
      defaultTag: "button",
      componentName: "Test",
      render: ({ children, ref }) => <Box ref={ref}>{children}</Box>,
    });

    type WithStaticsConfig = ComponentConfig<{
      componentName: "WithStatics";
      defaultTag: "div";
      ownProps: {};
      statics: { Sub: typeof SubComponent };
      defaultProps: {};
    }>;

    const WithStatics = ComponentFactory<WithStaticsConfig>({
      defaultTag: "div",
      componentName: "WithStatics",
      render: ({ children, ref }) => <Box ref={ref}>{children}</Box>,
      statics: { Sub: SubComponent },
    });

    it("asigna sub-componentes como statics", () => {
      expect(WithStatics.Sub).toBe(SubComponent);
    });

    it("renderiza con sub-componentes", () => {
      render(
        <WithStatics><WithStatics.Sub>sub</WithStatics.Sub></WithStatics>,
        { wrapper },
      );
      expect(screen.getByText("sub")).toBeInTheDocument();
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("render que retorna null no lanza error", () => {
      const NullComponent = ComponentFactory<NoRenderConfig>({
        defaultTag: "div",
        render: () => null,
      });
      expect(() => render(<NullComponent />, { wrapper })).not.toThrow();
    });

    it("sin ThemeProvider lanza error", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<TestComponent>btn</TestComponent>)).toThrow();
      spy.mockRestore();
    });
  });
});
