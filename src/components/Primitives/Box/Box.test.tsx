// src/components/Box/Box.test.tsx
import { render } from "@testing-library/react";
import { createRef } from "react";
import userEvent from "@testing-library/user-event"; // ← agregás esto
import { describe, it, expect, vi } from "vitest";
import { Box } from "./Box";
import { ThemeContextProvider } from "../../../theme/ThemeContext";
import { defaultTheme } from "../../../theme";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeContextProvider value={{ theme: defaultTheme }}>
    {children}
  </ThemeContextProvider>
);

describe("Box", () => {
  // ─── Renderizado base ─────────────────────────────────────────
  describe("renderizado", () => {
    it("renderiza un div por default", () => {
      const { container } = render(<Box>contenido</Box>, { wrapper });
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renderiza children", () => {
      const { getByText } = render(<Box>hola mundo</Box>, { wrapper });
      expect(getByText("hola mundo")).toBeInTheDocument();
    });

    it("renderiza otro elemento con as", () => {
      const { container } = render(<Box as="section">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("aplica className", () => {
      const { container } = render(<Box className="mi-clase">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild).toHaveClass("mi-clase");
    });
  });

  // ─── Ref ──────────────────────────────────────────────────────
  describe("ref", () => {
    it("ref apunta al div por default", () => {
      const ref = createRef<HTMLDivElement>();
      render(<Box ref={ref}>contenido</Box>, { wrapper });
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("ref apunta al elemento correcto con as", () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Box as="button" ref={ref}>
          contenido
        </Box>,
        { wrapper },
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ─── Mod ──────────────────────────────────────────────────────
  describe("mod", () => {
    it("genera data attributes desde objeto", () => {
      const { container } = render(
        <Box mod={{ variant: "solid" }}>contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
    });

    it("genera data attribute desde string", () => {
      const { container } = render(<Box mod="active">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild).toHaveAttribute("data-active", "true");
    });

    it("no genera data attribute con valor false", () => {
      const { container } = render(
        <Box mod={{ loading: false }}>contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("data-loading");
    });
  });

  // ─── Slot ─────────────────────────────────────────────────────
  describe("slot", () => {
    it("genera data-slot", () => {
      const { container } = render(<Box dataSlot="header">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild).toHaveAttribute("data-slot", "header");
    });

    it("no genera data-slot si no se pasa", () => {
      const { container } = render(<Box>contenido</Box>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("data-slot");
    });
  });

  // ─── Style ────────────────────────────────────────────────────
  describe("style inline", () => {
    it("style inline gana sobre StyleProps", () => {
      const { container } = render(
        <Box p="md" style={{ padding: "999px" }}>
          contenido
        </Box>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBe("999px");
    });

    it("unstyled ignora StyleProps", () => {
      const { container } = render(
        <Box p="md" unstyled>
          contenido
        </Box>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.padding).toBeFalsy();
    });
  });

  // ─── HTML attributes nativos ──────────────────────────────────
  describe("html attributes", () => {
    it("pasa onClick al DOM", async () => {
      const user = userEvent.setup(); // ← setup primero
      const handleClick = vi.fn();

      const { container } = render(<Box onClick={handleClick}>click</Box>, {
        wrapper,
      });
      await user.click(container.firstChild as HTMLElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("pasa id al DOM", () => {
      const { container } = render(<Box id="mi-id">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild).toHaveAttribute("id", "mi-id");
    });

    it("pasa aria-label al DOM", () => {
      const { container } = render(
        <Box aria-label="descripción">contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("aria-label", "descripción");
    });

    it("pasa href cuando as='a'", () => {
      const { container } = render(
        <Box as="a" href="/home">
          link
        </Box>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("href", "/home");
    });
  });

  // ─── SystemProps no llegan al DOM ─────────────────────────────
  describe("SystemProps no llegan al DOM", () => {
    it("p no existe como atributo HTML", () => {
      const { container } = render(<Box p="md">contenido</Box>, { wrapper });
      expect(container.firstChild).not.toHaveAttribute("p");
    });

    it("bg no existe como atributo HTML", () => {
      const { container } = render(<Box bg="primary.500">contenido</Box>, {
        wrapper,
      });
      expect(container.firstChild).not.toHaveAttribute("bg");
    });

    it("mod no existe como atributo HTML", () => {
      const { container } = render(
        <Box mod={{ variant: "solid" }}>contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild).not.toHaveAttribute("mod");
    });
  });

  // ─── vars ─────────────────────────────────────────────────────
  describe("CSS vars", () => {
    it("inyecta CSS custom properties como style", () => {
      const { container } = render(
        <Box vars={{ "--my-color": "red" }}>contenido</Box>,
        { wrapper },
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--my-color")).toBe("red");
    });
  });

  // ─── renderRoot ───────────────────────────────────────────────
  describe("renderRoot", () => {
    it("renderRoot reemplaza el render por defecto", () => {
      const { container } = render(
        <Box renderRoot={(props) => <section {...props} />}>contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });
  });

  // ─── Compound mod array ───────────────────────────────────────
  describe("mod array", () => {
    it("combina múltiples mods", () => {
      const { container } = render(
        <Box mod={[{ variant: "solid" }, "active"]}>contenido</Box>,
        { wrapper },
      );
      expect(container.firstChild).toHaveAttribute("data-variant", "solid");
      expect(container.firstChild).toHaveAttribute("data-active", "true");
    });
  });

  // ─── Responsive props ─────────────────────────────────────────
  describe("responsive props", () => {
    it("acepta objeto responsive sin error", () => {
      expect(() =>
        render(<Box mt={{ base: "sm", md: "lg" }}>contenido</Box>, { wrapper }),
      ).not.toThrow();
    });
  });
});
