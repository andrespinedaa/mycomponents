import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { STYLE_PROPS_DATA } from "../../system";

import type { ArgTypes } from "@storybook/react";

export const STYLE_PROPS_ARG_TYPES: ArgTypes = Object.fromEntries(
  Object.entries(STYLE_PROPS_DATA).map(([key, value]) => [
    key,
    {
      control: {
        type: "text" as const,
      },
      table: {
        category: value.category,
      },
    },
  ]),
);

const meta = {
  title: "Primitives/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    ...STYLE_PROPS_ARG_TYPES,
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithVars: Story = {
  render: () => (
    <Box
      vars={{ "--box-color": "#3b82f6", "--box-padding": "1rem" }}
      style={{
        background: "var(--box-color)",
        padding: "var(--box-padding)",
        color: "white",
        borderRadius: "8px",
      }}
    >
      Usa CSS vars inyectadas
    </Box>
  ),
};

export const WithSlot: Story = {
  render: () => (
    <Box
      slot="root"
      style={{ display: "flex", gap: "8px", alignItems: "center" }}
    >
      <Box as="span" slot="icon">
        🎯
      </Box>
      <Box as="span" slot="label">
        Con data-slot en cada parte
      </Box>
    </Box>
  ),
};

export const WithMod: Story = {
  render: () => (
    <Box mod={{ variant: "solid", size: "lg" }} style={{ padding: "1rem" }}>
      Inspecciona el DOM: data-variant="solid" data-size="lg"
    </Box>
  ),
};

export const WithRef: Story = {
  render: () => {
    const ref = (el: HTMLDivElement | null) => {
      if (el) console.log("ref conectado:", el.tagName);
    };
    return <Box ref={ref}>El ref está en la consola</Box>;
  },
};

export const RenderRoot: Story = {
  render: () => (
    <Box
      renderRoot={(props) => (
        <a href="https://example.com" {...props}>
          Renderizado como enlace externo
        </a>
      )}
    />
  ),
};
