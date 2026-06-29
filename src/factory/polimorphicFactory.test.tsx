import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, forwardRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { defaultTheme, ThemeProvider } from "../theme";
import { PolymorphicFactory } from "./PolymorphicFactory";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
);

// ─── Componentes de prueba ────────────────────────────────────
const TestBox = PolymorphicFactory({ defaultTag: "div", componentName: "TestBox" });

const TestBoxWithRender = PolymorphicFactory({
  defaultTag: "div",
  componentName: "TestBoxRender",
  render: ({ ref, Component, theme: _t, hooks: _h, ...rest }) => (
    <Component ref={ref} data-custom="render" {...rest} />
  ),
});

describe("PolymorphicFactory", () => {

  // ─── 1. Renderizado base ─────────────────────────────────────
  describe("renderizado base", () => {
    it("renderiza el defaultTag correctamente", () => {
      const { container } = render(<TestBox>contenido</TestBox>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renderiza children", () => {
      render(<TestBox>hola mundo</TestBox>, { wrapper });
      expect(screen.getByText("hola mundo")).toBeInTheDocument();
    });

    it("renderiza sin children sin errores", () => {
      expect(() => render(<TestBox />, { wrapper })).not.toThrow();
    });

    it("renderiza múltiples children", () => {
      render(<TestBox><span>hijo 1</span><span>hijo 2</span></TestBox>, { wrapper });
      expect(screen.getByText("hijo 1")).toBeInTheDocument();
      expect(screen.getByText("hijo 2")).toBeInTheDocument();
    });
  });

  // ─── 2. Polimorfismo — as ────────────────────────────────────
  describe("polimorfismo — as", () => {
    it("renderiza como section con as='section'", () => {
      const { container } = render(<TestBox as="section">contenido</TestBox>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renderiza como button con as='button'", () => {
      const { container } = render(<TestBox as="button">contenido</TestBox>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("BUTTON");
    });

    it("renderiza como a con as='a' y pasa href", () => {
      const { container } = render(<TestBox as="a" href="/home">link</TestBox>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("A");
      expect(container.firstChild).toHaveAttribute("href", "/home");
    });

    it("renderiza como componente React externo con as", () => {
      const CustomComponent = forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
        ({ children, ...props }, ref) => <div ref={ref} data-custom="true" {...props}>{children}</div>
      );
      const { container } = render(<TestBox as={CustomComponent}>contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-custom", "true");
    });

    it("sin as usa el defaultTag", () => {
      const TestSection = PolymorphicFactory({ defaultTag: "section" });
      const { container } = render(<TestSection>contenido</TestSection>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });
  });

  // ─── 3. Ref ──────────────────────────────────────────────────
  describe("ref", () => {
    it("ref apunta al elemento correcto por default", () => {
      const ref = createRef<HTMLDivElement>();
      render(<TestBox ref={ref}>contenido</TestBox>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("ref apunta al elemento correcto con as='button'", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<TestBox as="button" ref={ref}>contenido</TestBox>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("ref no es null después del mount", () => {
      const ref = createRef<HTMLDivElement>();
      render(<TestBox ref={ref}>contenido</TestBox>, { wrapper });
      expect(ref.current).not.toBeNull();
    });

    it("ref callback funciona correctamente", () => {
      const refCallback = vi.fn();
      render(<TestBox ref={refCallback}>contenido</TestBox>, { wrapper });
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // ─── 4. SystemProps no llegan al DOM ─────────────────────────
  describe("SystemProps no llegan al DOM", () => {
    const styleProps = ["p", "m", "bg", "color", "display", "flex", "align",
      "justifyContent", "gap", "w", "h", "rounded", "fontSize", "fontWeight",
      "position", "top", "zIndex", "overflow"];

    styleProps.forEach((prop) => {
      it(`"${prop}" no existe como atributo HTML`, () => {
        const { container } = render(<TestBox {...{ [prop]: "md" }}>contenido</TestBox>, { wrapper });
        expect(container.firstChild).not.toHaveAttribute(prop);
      });
    });

    it("BaseProps no llegan al DOM", () => {
      const { container } = render(
        <TestBox mod={{ variant: "solid" }} vars={{ "--x": "1" }} unstyled>contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("mod");
      expect(container.firstChild).not.toHaveAttribute("vars");
      expect(container.firstChild).not.toHaveAttribute("unstyled");
    });

    it("size no llega como atributo HTML nativo", () => {
      const { container } = render(<TestBox size="md">contenido</TestBox>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("size");
    });
  });

  // ─── 5. mod ──────────────────────────────────────────────────
  describe("mod", () => {
    it("genera data attribute desde objeto", () => {
      const { container } = render(<TestBox mod={{ variant: "solid" }}>contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
    });

    it("genera data attribute desde string", () => {
      const { container } = render(<TestBox mod="active">contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-active", "true");
    });

    it("no genera data attribute con valor false", () => {
      const { container } = render(<TestBox mod={{ loading: false }}>contenido</TestBox>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("data-loading");
    });

    it("combina array de mods", () => {
      const { container } = render(
        <TestBox mod={[{ variant: "solid" }, "focused"]}>contenido</TestBox>, { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
      expect(container.firstChild).toHaveAttribute("data-focused", "true");
    });

    it("último mod gana en colisión", () => {
      const { container } = render(
        <TestBox mod={[{ variant: "solid" }, { variant: "outline" }]}>contenido</TestBox>, { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "outline");
    });
  });

  // ─── 6. data-slot ────────────────────────────────────────────
  describe("data-slot", () => {
    it("componentName genera data-slot automático", () => {
      const { container } = render(<TestBox>contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-slot", "TestBox");
    });

    it("dataSlot sobreescribe componentName", () => {
      const { container } = render(<TestBox dataSlot="header">contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-slot", "header");
    });

    it("sin componentName ni dataSlot — no genera data-slot", () => {
      const Anon = PolymorphicFactory({ defaultTag: "div" });
      const { container } = render(<Anon>contenido</Anon>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("data-slot");
    });
  });

  // ─── 7. size ─────────────────────────────────────────────────
  describe("size", () => {
    it("size estático genera data-size", () => {
      const { container } = render(<TestBox size="lg">contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-size", "lg");
    });

    it("size responsive genera data-size y data-size-md", () => {
      const { container } = render(
        <TestBox size={{ base: "sm", md: "lg" }}>contenido</TestBox>, { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-size", "sm");
      expect(container.firstChild).toHaveAttribute("data-size-md", "lg");
    });
  });

  // ─── 8. variant ──────────────────────────────────────────────
  describe("variant", () => {
    it("variant genera data-variant", () => {
      const { container } = render(<TestBox variant="solid">contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
    });
  });

  // ─── 9. vars ─────────────────────────────────────────────────
  describe("vars", () => {
    it("inyecta CSS custom properties como style", () => {
      const { container } = render(<TestBox vars={{ "--my-color": "red" }}>contenido</TestBox>, { wrapper });
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--my-color")).toBe("red");
    });

    it("combina vars con StyleProps", () => {
      const { container } = render(
        <TestBox p="md" vars={{ "--my-color": "red" }}>contenido</TestBox>, { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--my-color")).toBe("red");
      expect(el.style.cssText).toContain("padding");
    });
  });

  // ─── 10. unstyled ────────────────────────────────────────────
  describe("unstyled", () => {
    it("unstyled ignora StyleProps", () => {
      const { container } = render(<TestBox p="md" bg="primary.500" unstyled>contenido</TestBox>, { wrapper });
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBeFalsy();
      expect(el.style.background).toBeFalsy();
    });

    it("unstyled respeta style inline", () => {
      const { container } = render(
        <TestBox p="md" style={{ padding: "999px" }} unstyled>contenido</TestBox>, { wrapper },
      );
      expect((container.firstChild as HTMLElement).style.padding).toBe("999px");
    });

    it("unstyled respeta vars", () => {
      const { container } = render(
        <TestBox p="md" vars={{ "--x": "1" }} unstyled>contenido</TestBox>, { wrapper },
      );
      expect((container.firstChild as HTMLElement).style.getPropertyValue("--x")).toBe("1");
    });
  });

  // ─── 11. renderRoot ──────────────────────────────────────────
  describe("renderRoot", () => {
    it("renderRoot reemplaza el render por defecto", () => {
      const { container } = render(
        <TestBox renderRoot={(props) => <section {...props} />}>contenido</TestBox>, { wrapper },
      );
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renderRoot recibe modProps y slotProps", () => {
      const renderRoot = vi.fn((props) => <div {...props} />);
      render(
        <TestBox mod={{ variant: "solid" }} dataSlot="header" renderRoot={renderRoot}>contenido</TestBox>,
        { wrapper },
      );
      expect(renderRoot).toHaveBeenCalledWith(
        expect.objectContaining({ "data-variant": "solid", "data-slot": "header" }),
      );
    });
  });

  // ─── 12. render personalizado ────────────────────────────────
  describe("render personalizado", () => {
    it("render personalizado agrega props extras", () => {
      const { container } = render(<TestBoxWithRender>contenido</TestBoxWithRender>, { wrapper });
      expect(container.firstChild).toHaveAttribute("data-custom", "render");
    });

    it("render personalizado recibe StyleProps accesibles", () => {
      let capturedP: unknown;
      const TestWithSpy = PolymorphicFactory({
        defaultTag: "div",
        render: ({ p, Component, theme: _t, hooks: _h, ref, ...rest }) => {
          capturedP = p;
          return <Component ref={ref} {...rest} />;
        },
      });
      render(<TestWithSpy p="md">contenido</TestWithSpy>, { wrapper });
      expect(capturedP).toBe("md");
    });

    it("render personalizado recibe theme", () => {
      let capturedPrefix: string | undefined;
      const ThemeBox = PolymorphicFactory({
        defaultTag: "div",
        render: ({ theme, Component, hooks: _h, ref, ...rest }) => {
          capturedPrefix = theme.cssVarPrefix;
          return <Component ref={ref} {...rest} />;
        },
      });
      render(<ThemeBox>contenido</ThemeBox>, { wrapper });
      expect(capturedPrefix).toBe(defaultTheme.cssVarPrefix);
    });

    it("render personalizado recibe hooks", () => {
      let capturedValue: number | undefined;
      const HookBox = PolymorphicFactory({
        defaultTag: "div",
        useHooks: () => ({ value: 99 }),
        render: ({ hooks, Component, theme: _t, ref, ...rest }) => {
          capturedValue = (hooks as any).value;
          return <Component ref={ref} {...rest} />;
        },
      });
      render(<HookBox>contenido</HookBox>, { wrapper });
      expect(capturedValue).toBe(99);
    });

    it("render recibe StyleProps accesibles para delegarlas a Box", () => {
      let capturedP: unknown;
      let capturedVars: unknown;
      const TestWithCapture = PolymorphicFactory({
        defaultTag: "div",
        render: ({ p, vars, Component, theme: _t, hooks: _h, ref, ...rest }) => {
          capturedP = p;
          capturedVars = vars;
          return <Component ref={ref} {...rest} />;
        },
      });
      render(<TestWithCapture p="md" vars={{ "--x": "1" }}>contenido</TestWithCapture>, { wrapper });
      expect(capturedP).toBe("md");
      expect(capturedVars).toEqual({ "--x": "1" });
    });
  });

  // ─── 13. HTML attributes nativos ─────────────────────────────
  describe("html attributes nativos", () => {
    it("pasa onClick al DOM", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const { container } = render(<TestBox onClick={handleClick}>click</TestBox>, { wrapper });
      await user.click(container.firstChild as HTMLElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("pasa aria-label", () => {
      const { container } = render(<TestBox aria-label="caja principal">contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("aria-label", "caja principal");
    });

    it("pasa tabIndex", () => {
      const { container } = render(<TestBox tabIndex={0}>contenido</TestBox>, { wrapper });
      expect(container.firstChild).toHaveAttribute("tabindex", "0");
    });
  });

  // ─── 14. defaultProps ────────────────────────────────────────
  describe("defaultProps", () => {
    const WithDefaults = PolymorphicFactory({
      defaultTag: "div",
      defaultProps: { id: "default-id" },
    });

    it("aplica defaultProps cuando el consumer no pasa la prop", () => {
      const { container } = render(<WithDefaults>contenido</WithDefaults>, { wrapper });
      expect(container.firstChild).toHaveAttribute("id", "default-id");
    });

    it("el consumer sobreescribe defaultProps", () => {
      const { container } = render(<WithDefaults id="custom-id">contenido</WithDefaults>, { wrapper });
      expect(container.firstChild).toHaveAttribute("id", "custom-id");
    });
  });

  // ─── 15. ThemeProvider ───────────────────────────────────────
  describe("ThemeProvider", () => {
    it("lanza error sin ThemeProvider", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<TestBox p="md">contenido</TestBox>)).toThrow();
      spy.mockRestore();
    });
  });
});
