import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Contenido de ejemplo reutilizable ───────────────────────────────────────
const SampleContent = () => (
  <>
    <Card.Section section="header" p="md" borderBottom="1px solid" borderColor="neutral.200">
      <strong>Card Header</strong>
    </Card.Section>
    <Card.Section section="body" p="md">
      Este es el cuerpo de la card con contenido de ejemplo.
    </Card.Section>
    <Card.Section section="footer" p="md" borderTop="1px solid" borderColor="neutral.200">
      Footer
    </Card.Section>
  </>
);

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    variant: "Default",
    size: "md",
    orientation: "vertical",
  },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <SampleContent />
    </Card>
  ),
};

// ─── AllVariants — variantes × tamaños ───────────────────────────────────────
const variants = ["Default", "Filled", "Elevated", "Outlined"] as const;
const sizes = ["sm", "md", "lg", "xl"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {variants.map((variant) => (
        <div key={variant}>
          <p style={{ marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>{variant}</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            {sizes.map((size) => (
              <div key={size} style={{ flex: 1 }}>
                <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>{size}</p>
                <Card variant={variant} size={size} orientation="vertical">
                  <Card.Section section="header" p="sm">Header</Card.Section>
                  <Card.Section section="body" p="sm">Body</Card.Section>
                  <Card.Section section="footer" p="sm">Footer</Card.Section>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── DefaultStates ───────────────────────────────────────────────────────────
export const DefaultStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: 360 }}>
      {(["Default", "Filled", "Elevated", "Outlined"] as const).map((variant) => (
        <div key={variant}>
          <p style={{ marginBottom: "0.5rem", fontSize: "0.75rem", color: "#888" }}>{variant}</p>
          <Card variant={variant} size="md">
            <Card.Section section="body" p="md">Normal</Card.Section>
          </Card>
        </div>
      ))}
    </div>
  ),
};

// ─── Orientation ─────────────────────────────────────────────────────────────
export const Orientation: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <p style={{ marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Vertical (default)</p>
        <Card variant="Default" size="md" orientation="vertical" style={{ width: 320 }}>
          <Card.Section section="media" style={{ height: 120, background: "#e5e7eb" }} />
          <Card.Section section="body" p="md">Contenido vertical</Card.Section>
        </Card>
      </div>
      <div>
        <p style={{ marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Horizontal</p>
        <Card variant="Default" size="md" orientation="horizontal" style={{ width: 400 }}>
          <Card.Section section="media" style={{ width: 120, background: "#e5e7eb" }} />
          <Card.Section section="body" p="md">Contenido horizontal</Card.Section>
        </Card>
      </div>
    </div>
  ),
};

// ─── CardSection ─────────────────────────────────────────────────────────────
export const Sections: Story = {
  render: () => (
    <Card variant="Default" size="md" style={{ width: 360 }}>
      <Card.Section section="header" p="md" style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        <strong>section="header"</strong>
      </Card.Section>
      <Card.Section section="media" style={{ height: 120, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
        section="media"
      </Card.Section>
      <Card.Section section="body" p="md">
        <p>section="body" — el contenido principal va aquí.</p>
      </Card.Section>
      <Card.Section section="footer" p="md" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
        section="footer"
      </Card.Section>
    </Card>
  ),
};
