import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentFactory } from "../factory/ComponentFactory";
import type { ComponentConfig } from "../factory/core/factories.types";
import { Box } from "../components/Primitives/Box/Box";
import { Layout } from "../components/Primitives/Box/Layout";
import { ThemeProvider } from "../theme";
import type { ComponentVariants, Theme } from "../theme/core/theme.types";
import { defaultTheme } from "../themes/default-theme";

// ─── Componentes de prueba — mimican la relación compound Card → Card.Section ──────────
type ParentConfig = ComponentConfig<{
  componentName: "TestParent";
  defaultTag: "div";
  ownProps: {};
  defaultProps: {};
  sizes: "md";
  variants: ComponentVariants;
  presets: "background";
}>;

const TestParent = ComponentFactory<ParentConfig>({
  componentName: "TestParent",
  render: function TestParentRender({ ref, set, variant, ...rest }) {
    return (
      <Layout ref={ref} data-testid="parent" set={set} variant={variant} {...rest} />
    );
  },
});

type ChildWithPresetConfig = ComponentConfig<{
  componentName: "TestChildWithPreset";
  defaultTag: "div";
  ownProps: {};
  defaultProps: {};
  sizes: "md";
  presets: "background" | "other";
}>;

const TestChildWithPreset = ComponentFactory<ChildWithPresetConfig>({
  componentName: "TestChildWithPreset",
  render: ({ ref, set, variant: _variant, ...rest }) => (
    <Box ref={ref} data-testid="child-with-preset" data-set={set} {...rest} />
  ),
});

type ChildNoPresetConfig = ComponentConfig<{
  componentName: "TestChildNoPreset";
  defaultTag: "div";
  ownProps: {};
  defaultProps: {};
  sizes: "md";
  presets: string;
}>;

const TestChildNoPreset = ComponentFactory<ChildNoPresetConfig>({
  componentName: "TestChildNoPreset",
  render: ({ ref, set, variant: _variant, ...rest }) => (
    <Box ref={ref} data-testid="child-no-preset" data-set={set} {...rest} />
  ),
});

type UnrelatedConfig = ComponentConfig<{
  componentName: "TestUnrelated";
  defaultTag: "div";
  ownProps: {};
  defaultProps: {};
  sizes: "md";
  presets: "background";
}>;

// Mismo nombre de preset que TestParent ("background") pero SIN parentName — no es de la familia.
const TestUnrelated = ComponentFactory<UnrelatedConfig>({
  componentName: "TestUnrelated",
  render: ({ ref, set, variant: _variant, ...rest }) => (
    <Box ref={ref} data-testid="unrelated" data-set={set} {...rest} />
  ),
});

const testTheme: Theme = {
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    TestParent: {
      sizes: { md: {} },
      presets: { background: { color: "red" } },
    },
    TestChildWithPreset: {
      sizes: { md: {} },
      parentName: "TestParent",
      presets: { background: { color: "blue" } },
    },
    TestChildNoPreset: {
      sizes: { md: {} },
      parentName: "TestParent",
    },
    TestUnrelated: {
      sizes: { md: {} },
      presets: { background: { color: "green" } },
    },
  },
} as unknown as Theme;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
);

// --- cascada de `set` por compound component ------------------------------------------

describe("resolveLayout — cascada de set por compound component", () => {
  it("el hijo hereda `set` del padre si declara un preset con el mismo nombre", () => {
    render(
      <TestParent set="background">
        <TestChildWithPreset />
      </TestParent>,
      { wrapper },
    );
    expect(screen.getByTestId("child-with-preset")).toHaveAttribute("data-set", "background");
  });

  it("el hijo NO hereda si no declara un preset con ese nombre (gate por nombre)", () => {
    render(
      <TestParent set="background">
        <TestChildNoPreset />
      </TestParent>,
      { wrapper },
    );
    expect(screen.getByTestId("child-no-preset")).not.toHaveAttribute("data-set");
  });

  it("un componente sin parentName NO hereda aunque declare el mismo nombre de preset (gate por familia)", () => {
    render(
      <TestParent set="background">
        <TestUnrelated />
      </TestParent>,
      { wrapper },
    );
    expect(screen.getByTestId("unrelated")).not.toHaveAttribute("data-set");
  });

  it("el `set` propio del hijo siempre gana sobre el heredado", () => {
    render(
      <TestParent set="background">
        <TestChildWithPreset set="other" />
      </TestParent>,
      { wrapper },
    );
    expect(screen.getByTestId("child-with-preset")).toHaveAttribute("data-set", "other");
  });

  it("sin `set` en el padre, el hijo no hereda nada", () => {
    render(
      <TestParent>
        <TestChildWithPreset />
      </TestParent>,
      { wrapper },
    );
    expect(screen.getByTestId("child-with-preset")).not.toHaveAttribute("data-set");
  });
});
