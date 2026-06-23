import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ComponentFactory } from "./ComponentFactory";
import { ThemeContextProvider } from "../theme/ThemeContext";
import { defaultTheme } from "../theme/default-theme";
import type { ComponentConfig, EmptyStatics } from "./factories.types";
import { Box } from "../components/Primitives/Box/Box";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeContextProvider value={{ theme: defaultTheme }}>
    {children}
  </ThemeContextProvider>
);

// ─── Componente de prueba ─────────────────────────────────────
interface TestOwnProps {
  variant?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
}

type TestConfig = ComponentConfig<{
  componentName: "Test";
  defaultTag: "button";
  ownProps: TestOwnProps;
  statics: EmptyStatics;
  defaultsProps: {};
}>;

type TestSubComponent = ComponentConfig<{
  componentName: "SubTest";
  defaultTag: "button";
  statics: EmptyStatics;
  defaultProps: {};
  ownProps: TestOwnProps;
}>;

const TestComponent = ComponentFactory<TestConfig>({
  defaultTag: "button",
  componentName: "Test",
  render: ({ variant = "solid", size = "md", children, ...rest }) => (
    <Box as="button" mod={{ variant, size }} {...rest}>
      {children}
    </Box>
  ),
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
        render: ({ children }) => <Box>{children}</Box>,
      });
      expect(NoName.displayName).toBeUndefined();
    });
  });

  // ─── renderizado ──────────────────────────────────────────────
  describe("renderizado", () => {
    it("renderiza el componente correctamente", () => {
      render(<TestComponent>click</TestComponent>, { wrapper });
      expect(screen.getByText("click")).toBeInTheDocument();
    });

    it("pasa OwnProps al render", () => {
      render(
        <TestComponent variant="outline" size="lg">
          btn
        </TestComponent>,
        { wrapper },
      );
      const el = screen.getByText("btn");
      expect(el).toHaveAttribute("data-variant", "outline");
      expect(el).toHaveAttribute("data-size", "lg");
    });

    it("aplica defaults cuando no se pasan OwnProps", () => {
      render(<TestComponent>btn</TestComponent>, { wrapper });
      const el = screen.getByText("btn");
      expect(el).toHaveAttribute("data-variant", "solid");
      expect(el).toHaveAttribute("data-size", "md");
    });

    it("pasa HTMLAttributes al elemento", () => {
      render(
        <TestComponent id="test-btn" aria-label="botón">
          btn
        </TestComponent>,
        { wrapper },
      );
      const el = screen.getByText("btn");
      expect(el).toHaveAttribute("id", "test-btn");
      expect(el).toHaveAttribute("aria-label", "botón");
    });

    it("pasa onClick", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TestComponent onClick={handleClick}>btn</TestComponent>, {
        wrapper,
      });
      await user.click(screen.getByText("btn"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ─── statics ──────────────────────────────────────────────────
  describe("statics", () => {
    const SubComponent = ComponentFactory<TestConfig>({
      defaultTag: "button",
      componentName: "Test",
      render: ({ children }) => <Box>{children}</Box>,
    });

    type WithStaticsConfig = ComponentConfig<{
      componentName: "WithStatics";
      defaultTag: "div";
      ownProps: {};
      statics: { Sub: typeof SubComponent };
      defaultsProps: {};
    }>;

    const WithStatics = ComponentFactory<WithStaticsConfig>({
      defaultTag: "div",
      componentName: "WithStatics",
      render: ({ children }) => <Box>{children}</Box>,
      statics: { Sub: SubComponent },
    });

    it("asigna sub-componentes como statics", () => {
      expect(WithStatics.Sub).toBe(SubComponent);
    });

    it("asigna displayName a sub-componentes", () => {
      expect(SubComponent.displayName).toBe("WithStatics.Sub");
    });

    it("renderiza con sub-componentes", () => {
      render(
        <WithStatics>
          <WithStatics.Sub>sub</WithStatics.Sub>
        </WithStatics>,
        { wrapper },
      );
      expect(screen.getByText("sub")).toBeInTheDocument();
    });
  });

  // ─── SystemProps via Box ───────────────────────────────────────
  describe("SystemProps via Box", () => {
    const StyledComponent = ComponentFactory<TestSubComponent>({
      defaultTag: "button",
      componentName: "SubTest",
      render: ({ children, p, bg, rounded, ...rest }) => (
        <Box as="button" p={p} bg={bg} rounded={rounded} {...rest}>
          {children}
        </Box>
      ),
    });

    it("aplica StyleProps pasadas a Box", () => {
      render(
        <StyledComponent p="md" bg="primary.500" rounded="lg">
          btn
        </StyledComponent>,
        { wrapper },
      );
      const el = screen.getByText("btn");
      expect(el.style.padding).toBeTruthy();
      expect(el.style.background).toBeTruthy();
      expect(el.style.borderRadius).toBeTruthy();
    });
  });

  // ─── edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("statics vacíos no rompen el componente", () => {
      const NoStatics = ComponentFactory<TestSubComponent>({
        defaultTag: "button",
        componentName: "SubTest",
        render: ({ children }) => <Box>{children}</Box>,
        statics: {} as EmptyStatics,
      });
      expect(() =>
        render(<NoStatics>contenido</NoStatics>, { wrapper }),
      ).not.toThrow();
    });

    it("retorna null sin error", () => {
      const NullComponent = ComponentFactory<TestSubComponent>({
        defaultTag: "button",
        componentName: "SubTest",
        render: () => null,
      });
      expect(() => render(<NullComponent />, { wrapper })).not.toThrow();
    });
  });
});
