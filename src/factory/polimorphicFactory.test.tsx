import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, forwardRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { defaultTheme } from "../theme";
import { ThemeContextProvider } from "../theme/ThemeContext";
import { PolymorphicFactory } from "./PolymorphicFactory";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeContextProvider value={{ theme: defaultTheme }}>
    {children}
  </ThemeContextProvider>
);

// Componente de prueba creado con PolymorphicFactory
const TestBox = PolymorphicFactory({ defaultTag: "div" });
TestBox.displayName = "TestBox";

// Componente con render personalizado
const TestBoxWithRender = PolymorphicFactory({
  defaultTag: "div",
  render: ({ props, Component, componentProps, getStyle }) => {
    const { ref, className } = props as any;
    return (
      <Component
        ref={ref}
        className={className}
        style={getStyle()}
        data-custom="render"
        {...componentProps}
      />
    );
  },
});

// ─── Suite ────────────────────────────────────────────────────────────────────
describe("PolymorphicFactory", () => {
  // ─── 1. Renderizado base ────────────────────────────────────────────────────
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
      render(
        <TestBox>
          <span>hijo 1</span>
          <span>hijo 2</span>
        </TestBox>,
        { wrapper },
      );
      expect(screen.getByText("hijo 1")).toBeInTheDocument();
      expect(screen.getByText("hijo 2")).toBeInTheDocument();
    });
  });

  // ─── 2. Polimorfismo — as ───────────────────────────────────────────────────
  describe("polimorfismo — as", () => {
    it("renderiza como section con as='section'", () => {
      const { container } = render(<TestBox as="section">contenido</TestBox>, {
        wrapper,
      });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renderiza como button con as='button'", () => {
      const { container } = render(<TestBox as="button">contenido</TestBox>, {
        wrapper,
      });
      expect(container.firstChild?.nodeName).toBe("BUTTON");
    });

    it("renderiza como a con as='a' y pasa href", () => {
      const { container } = render(
        <TestBox as="a" href="/home">
          link
        </TestBox>,
        { wrapper },
      );
      expect(container.firstChild?.nodeName).toBe("A");
      expect(container.firstChild).toHaveAttribute("href", "/home");
    });

    it("renderiza como componente React externo con as", () => {
      const CustomComponent = forwardRef<
        HTMLDivElement,
        { children?: React.ReactNode }
      >(({ children, ...props }, ref) => (
        <div ref={ref} data-custom="true" {...props}>
          {children}
        </div>
      ));

      const { container } = render(
        <TestBox as={CustomComponent}>contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-custom", "true");
    });

    it("sin as usa el defaultTag", () => {
      const TestSection = PolymorphicFactory({ defaultTag: "section" });
      const { container } = render(<TestSection>contenido</TestSection>, {
        wrapper,
      });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });
  });

  // ─── 3. Ref ─────────────────────────────────────────────────────────────────
  describe("ref", () => {
    it("ref apunta al elemento correcto por default", () => {
      const ref = createRef<HTMLDivElement>();
      render(<TestBox ref={ref}>contenido</TestBox>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("ref apunta al elemento correcto con as='button'", () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <TestBox as="button" ref={ref}>
          contenido
        </TestBox>,
        { wrapper },
      );
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

  // ─── 4. SystemProps no llegan al DOM ────────────────────────────────────────
  describe("SystemProps no llegan al DOM", () => {
    const styleProps = [
      "p",
      "m",
      "bg",
      "color",
      "display",
      "flex",
      "align",
      "justifyContent",
      "gap",
      "w",
      "h",
      "rounded",
      "fontSize",
      "fontWeight",
      "position",
      "top",
      "zIndex",
      "overflow",
    ];

    styleProps.forEach((prop) => {
      it(`"${prop}" no existe como atributo HTML`, () => {
        const { container } = render(
          <TestBox {...{ [prop]: "md" }}>contenido</TestBox>,
          { wrapper },
        );
        expect(container.firstChild).not.toHaveAttribute(prop);
      });
    });

    it("BaseProps no llegan al DOM", () => {
      const { container } = render(
        <TestBox
          mod={{ variant: "solid" }}
          slot="header"
          vars={{ "--x": "1" }}
          unstyled
        >
          contenido
        </TestBox>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("mod");
      expect(container.firstChild).not.toHaveAttribute("vars");
      expect(container.firstChild).not.toHaveAttribute("unstyled");
    });
  });

  // ─── 5. mod ─────────────────────────────────────────────────────────────────
  describe("mod", () => {
    it("genera data attribute desde objeto", () => {
      const { container } = render(
        <TestBox mod={{ variant: "solid" }}>contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
    });

    it("genera data attribute desde string", () => {
      const { container } = render(<TestBox mod="active">contenido</TestBox>, {
        wrapper,
      });
      expect(container.firstChild).toHaveAttribute("data-active", "true");
    });

    it("no genera data attribute con valor false", () => {
      const { container } = render(
        <TestBox mod={{ loading: false }}>contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("data-loading");
    });

    it("combina array de mods", () => {
      const { container } = render(
        <TestBox mod={[{ variant: "solid" }, "focused"]}>contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
      expect(container.firstChild).toHaveAttribute("data-focused", "true");
    });

    it("último mod gana en colisión", () => {
      const { container } = render(
        <TestBox mod={[{ variant: "solid" }, { variant: "outline" }]}>
          contenido
        </TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "outline");
    });
  });

  // ─── 6. slot ────────────────────────────────────────────────────────────────
  describe("slot", () => {
    it("genera data-slot", () => {
      const { container } = render(
        <TestBox dataSlot="header">contenido</TestBox>,
        {
          wrapper,
        },
      );
      expect(container.firstChild).toHaveAttribute("data-slot", "header");
    });

    it("no genera data-slot si no se pasa", () => {
      const { container } = render(<TestBox>contenido</TestBox>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("data-slot");
    });

    it("slot no llega como atributo HTML nativo", () => {
      const { container } = render(
        <TestBox dataSlot="header">contenido</TestBox>,
        {
          wrapper,
        },
      );
      // data-slot sí, slot nativo no
      expect(container.firstChild).toHaveAttribute("data-slot", "header");
      expect(container.firstChild).not.toHaveAttribute("slot");
    });
  });

  // ─── 7. vars ────────────────────────────────────────────────────────────────
  describe("vars", () => {
    it("inyecta CSS custom properties como style", () => {
      const { container } = render(
        <TestBox vars={{ "--my-color": "red" }}>contenido</TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--my-color")).toBe("red");
    });

    it("combina vars con StyleProps", () => {
      const { container } = render(
        <TestBox p="md" vars={{ "--my-color": "red" }}>
          contenido
        </TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--my-color")).toBe("red");
      expect(el.style.cssText).toContain("padding");
    });
  });

  // ─── 8. style inline ────────────────────────────────────────────────────────
  describe("style inline", () => {
    it("style inline gana sobre StyleProps", () => {
      const { container } = render(
        <TestBox p="md" style={{ padding: "999px" }}>
          contenido
        </TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBe("999px");
    });

    it("className se aplica correctamente", () => {
      const { container } = render(
        <TestBox className="mi-clase">contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveClass("mi-clase");
    });
  });

  // ─── 9. unstyled ────────────────────────────────────────────────────────────
  describe("unstyled", () => {
    it("unstyled ignora StyleProps", () => {
      const { container } = render(
        <TestBox p="md" bg="primary.500" unstyled>
          contenido
        </TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBeFalsy();
      expect(el.style.background).toBeFalsy();
    });

    it("unstyled respeta style inline", () => {
      const { container } = render(
        <TestBox p="md" style={{ padding: "999px" }} unstyled>
          contenido
        </TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBe("999px");
    });

    it("unstyled respeta vars", () => {
      const { container } = render(
        <TestBox p="md" vars={{ "--x": "1" }} unstyled>
          contenido
        </TestBox>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--x")).toBe("1");
    });
  });

  // ─── 10. renderRoot ─────────────────────────────────────────────────────────
  describe("renderRoot", () => {
    it("renderRoot reemplaza el render por defecto", () => {
      const { container } = render(
        <TestBox renderRoot={(props) => <section {...props} />}>
          contenido
        </TestBox>,
        { wrapper },
      );
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renderRoot recibe modProps y slotProps", () => {
      const renderRoot = vi.fn((props) => <div {...props} />);
      render(
        <TestBox
          mod={{ variant: "solid" }}
          dataSlot="header"
          renderRoot={renderRoot}
        >
          contenido
        </TestBox>,
        { wrapper },
      );
      expect(renderRoot).toHaveBeenCalledWith(
        expect.objectContaining({
          "data-variant": "solid",
          "data-slot": "header",
        }),
      );
    });
  });

  // ─── 11. render personalizado ───────────────────────────────────────────────
  describe("render personalizado", () => {
    it("render personalizado agrega props extras", () => {
      const { container } = render(
        <TestBoxWithRender>contenido</TestBoxWithRender>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-custom", "render");
    });

    it("render personalizado recibe getStyle funcional", () => {
      const getStyleSpy = vi.fn();
      const TestWithSpy = PolymorphicFactory({
        defaultTag: "div",
        render: ({ getStyle, Component, componentProps }) => {
          getStyleSpy(getStyle());
          return <Component {...componentProps} />;
        },
      });

      render(<TestWithSpy p="md">contenido</TestWithSpy>, { wrapper });

      // getStyle() ahora retorna { styles, hasResponsive }
      expect(getStyleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          styles: expect.objectContaining({ padding: expect.any(String) }),
          hasResponsive: false, // "md" es valor plano → no responsive
        }),
      );
    });
  });

  // ─── 12. HTML attributes nativos ────────────────────────────────────────────
  describe("html attributes nativos", () => {
    it("pasa onClick al DOM", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      const { container } = render(
        <TestBox onClick={handleClick}>click</TestBox>,
        { wrapper },
      );
      await user.click(container.firstChild as HTMLElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("pasa onMouseEnter y onMouseLeave", async () => {
      const user = userEvent.setup();
      const handleEnter = vi.fn();
      const handleLeave = vi.fn();
      const { container } = render(
        <TestBox onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          hover
        </TestBox>,
        { wrapper },
      );
      await user.hover(container.firstChild as HTMLElement);
      await user.unhover(container.firstChild as HTMLElement);
      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleLeave).toHaveBeenCalledTimes(1);
    });

    it("pasa aria-label", () => {
      const { container } = render(
        <TestBox aria-label="caja principal">contenido</TestBox>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute(
        "aria-label",
        "caja principal",
      );
    });

    it("pasa tabIndex", () => {
      const { container } = render(<TestBox tabIndex={0}>contenido</TestBox>, {
        wrapper,
      });
      expect(container.firstChild).toHaveAttribute("tabindex", "0");
    });
  });

  // ─── 13. displayName ────────────────────────────────────────────────────────
  describe("displayName", () => {
    it("acepta displayName", () => {
      expect(() => {
        TestBox.displayName = "TestBox";
      }).not.toThrow();
      expect(TestBox.displayName).toBe("TestBox");
    });
  });

  // ─── 15. ThemeProvider ──────────────────────────────────────────────────────
  describe("ThemeProvider", () => {
    it("lanza error sin ThemeProvider", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<TestBox p="md">contenido</TestBox>)).toThrow();
      spy.mockRestore();
    });
  });
});
