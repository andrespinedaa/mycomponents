import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "../Stack/Stack";
import { Text } from "../Text/Text";
import { Divider } from "./Divider";

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
    thickness: {
      control: "text",
      description: "Grosor del borde (cualquier valor CSS: 1px, 2px, 0.5rem…)",
    },
    color: {
      control: "text",
      description: "Color del borde — token de tema (primary.500) o valor CSS",
    },
    label: {
      control: "text",
      description: "Texto centrado sobre el separador",
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {},
  render: (args) => (
    <Stack gap="sm" w="400px">
      <Text>Sección A</Text>
      <Divider {...args} />
      <Text>Sección B</Text>
    </Stack>
  ),
};

// ─── Thickness ────────────────────────────────────────────────────────────────

export const Thickness: Story = {
  render: () => (
    <Stack gap="lg" w="400px">
      <Divider thickness="1px" />
      <Divider thickness="2px" />
      <Divider thickness="4px" />
      <Divider thickness="8px" />
    </Stack>
  ),
};

// ─── Color ────────────────────────────────────────────────────────────────────

export const Color: Story = {
  render: () => (
    <Stack gap="lg" w="400px">
      <Divider color="primary.300" />
      <Divider color="primary.500" />
      <Divider color="primary.700" />
      <Divider color="neutral.300" thickness="2px" />
    </Stack>
  ),
};

// ─── Label ────────────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  args: { label: "o continúa con" },
  render: (args) => (
    <Stack gap="lg" w="400px">
      <Divider {...args} />
      <Divider label="Sección" color="primary.400" thickness="2px" />
      <Divider label="2024" />
    </Stack>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "stretch", gap: "1rem", height: "80px" }}>
      <Text>Izquierda</Text>
      <Divider orientation="vertical" />
      <Text>Centro</Text>
      <Divider orientation="vertical" thickness="2px" color="primary.500" />
      <Text>Derecha</Text>
    </div>
  ),
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    orientation: "horizontal",
    thickness: "1px",
    label: "",
  },
  render: (args) => (
    <Stack gap="sm" w="400px">
      <Text>Arriba del separador</Text>
      <Divider {...args} />
      <Text>Abajo del separador</Text>
    </Stack>
  ),
};
