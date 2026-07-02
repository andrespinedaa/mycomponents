import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Box } from "../components/Primitives/Box/Box";
import { ThemeProvider, type SystemVariants } from "../theme";
import { useTheme } from "../hooks";
import { defaultTheme } from "../theme/default-theme";
import { ComponentFactory } from "./ComponentFactory";
import type { ComponentConfig, EmptyStatics } from "./core/factories.types";

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
  sizes: never;
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

  // ─── styleProps en render path ────────────────────────────────
  describe("styleProps en render path — fluyen a Box", () => {
    it("styleProps se resuelven en el elemento final", () => {
      render(<TestComponent p="16px">btn</TestComponent>, { wrapper });
      expect(screen.getByText("btn")).toHaveStyle({ padding: "16px" });
    });

    it("style crudo fluye y se aplica", () => {
      render(
        <TestComponent style={{ cursor: "pointer" }}>btn</TestComponent>,
        { wrapper },
      );
      expect(screen.getByText("btn")).toHaveStyle({ cursor: "pointer" });
    });

    it("vars fluyen como CSS custom properties", () => {
      render(
        <TestComponent vars={{ "--custom-color": "red" }}>btn</TestComponent>,
        { wrapper },
      );
      const el = screen.getByText("btn");
      expect(el.style.getPropertyValue("--custom-color")).toBe("red");
    });

    it("style y styleProps coexisten sin pisarse", () => {
      render(
        <TestComponent p="8px" style={{ cursor: "pointer" }}>btn</TestComponent>,
        { wrapper },
      );
      const el = screen.getByText("btn");
      expect(el).toHaveStyle({ padding: "8px", cursor: "pointer" });
    });
  });

  // ─── fallback sin render ──────────────────────────────────────
  describe("sin render — fallback a Element", () => {
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

    it("styleProps se resuelven como inline style", () => {
      const { container } = render(
        <NoRenderComponent p="20px">contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveStyle({ padding: "20px" });
    });

    it("style crudo se aplica en el fallback", () => {
      const { container } = render(
        <NoRenderComponent style={{ opacity: "0.5" }}>contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveStyle({ opacity: "0.5" });
    });

    it("style y styleProps se mergean en el fallback", () => {
      const { container } = render(
        <NoRenderComponent p="12px" style={{ cursor: "pointer" }}>contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveStyle({ padding: "12px", cursor: "pointer" });
    });

    it("responsive styleProp genera data-responsive en el fallback", () => {
      const { container } = render(
        <NoRenderComponent p={{ base: "8px", md: "16px" }}>contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-responsive", "true");
    });

    it("styleProp estático no genera data-responsive", () => {
      const { container } = render(
        <NoRenderComponent p="8px">contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("data-responsive", "true");
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
    it("genera data-slot en fallback sin render", () => {
      const { container } = render(<NoRenderComponent>contenido</NoRenderComponent>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-slot", "NoRender");
    });

    it("dataSlot sobreescribe componentName", () => {
      const { container } = render(
        <NoRenderComponent dataSlot="custom">contenido</NoRenderComponent>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "custom");
    });

    it("sin componentName ni dataSlot no genera data-slot", () => {
      type AnonConfig = ComponentConfig<{
        componentName: "";
        defaultTag: "div";
        ownProps: {};
        statics: EmptyStatics;
        defaultProps: {};
        sizes: never;
      }>;
      const Anon = ComponentFactory<AnonConfig>({ defaultTag: "div" });
      const { container } = render(<Anon>contenido</Anon>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("data-slot");
    });
  });

  // ─── theme en render ──────────────────────────────────────────
  describe("theme en render", () => {
    it("theme accesible via useTheme en renders que lo necesitan", () => {
      let prefix: string | undefined;
      const ThemeComponent = ComponentFactory<NoRenderConfig>({
        defaultTag: "div",
        render: function ThemeRender({ ref, children, ...rest }) {
          const { theme } = useTheme();
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
      sizes: never;
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
