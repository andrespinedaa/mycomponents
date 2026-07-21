import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../Text/Text";
import { Divider } from "./Divider";
import { Box } from "../Box";

const meta = {
  title: "Primitives/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Dirección del separador",
    },
    size: {
      control: "radio",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Tamaño del separador — controla su grosor via el tema",
    },
    color: {
      control: "text",
      description: "Color del borde — token de tema (primary.500) o valor CSS",
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {},
  render: (args) => (
    <Box gap="sm" w="400px">
      <Text>Sección A</Text>
      <Divider {...args} />
      <Text>Sección B</Text>
    </Box>
  ),
};

// ─── Size ─────────────────────────────────────────────────────────────────────

export const Size: Story = {
  render: () => (
    <Box gap="lg" w="400px">
      <Divider size="xs" />
      <Divider size="sm" />
      <Divider size="md" />
      <Divider size="lg" />
      <Divider size="xl" />
    </Box>
  ),
};

// ─── Color ────────────────────────────────────────────────────────────────────

export const Color: Story = {
  render: () => (
    <Box gap="lg" w="400px">
      <Divider color="primary.300" />
      <Divider color="primary.500" />
      <Divider color="primary.700" />
      <Divider color="neutral.300" size="md" />
    </Box>
  ),
};

// ─── Label ────────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => (
    <Box gap="lg" w="400px">
      <Divider>o continúa con</Divider>
      <Divider color="primary.400" size="md">Sección</Divider>
      <Divider>2024</Divider>
    </Box>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "stretch", gap: "1rem", height: "80px" }}>
      <Text>Izquierda</Text>
      <Divider orientation="vertical" />
      <Text>Centro</Text>
      <Divider orientation="vertical" size="md" color="primary.500" />
      <Text>Derecha</Text>
    </div>
  ),
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    orientation: "horizontal",
    size: "sm",
  },
  render: (args) => (
    <Box gap="sm" w="400px">
      <Text>Arriba del separador</Text>
      <Divider {...args} />
      <Text>Abajo del separador</Text>
    </Box>
  ),
};
