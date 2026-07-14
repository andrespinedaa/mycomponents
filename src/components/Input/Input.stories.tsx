import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ─── Default ─────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => <Input placeholder="Escribe algo..." />,
};

// ─── AllVariants — variantes × tamaños ───────────────────────────────────────
const variants = [undefined, "Filled"] as const;
const variantLabels = ["Base", "Filled"];
const sizes = ["sm", "md", "lg"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: 480 }}>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
        <span />
        {sizes.map((size) => (
          <span key={size} style={{ fontSize: "0.75rem", color: "#888", textAlign: "center" }}>{size}</span>
        ))}
        {variants.map((variant, i) => (
          <>
            <span key={`label-${variantLabels[i]}`} style={{ fontSize: "0.75rem", fontWeight: 600 }}>{variantLabels[i]}</span>
            {sizes.map((size) => (
              <Input key={`${variantLabels[i]}-${size}`} variant={variant} size={size} placeholder="Placeholder" />
            ))}
          </>
        ))}
      </div>
    </div>
  ),
};

// ─── BaseStates — estilos base (sin variante) ────────────────────────────────
export const BaseStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 360 }}>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Normal</p>
        <Input placeholder="Placeholder" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Con label + hint</p>
        <Input label="Correo electrónico" hint="Usaremos este correo para contactarte." placeholder="tu@email.com" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Inválido</p>
        <Input label="Correo electrónico" error="El correo no es válido." placeholder="tu@email.com" defaultValue="correo-malo" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Deshabilitado</p>
        <Input label="Correo electrónico" placeholder="tu@email.com" disabled />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Requerido</p>
        <Input label="Nombre" placeholder="Tu nombre" required />
      </div>
    </div>
  ),
};

// ─── FilledStates ─────────────────────────────────────────────────────────────
export const FilledStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 360 }}>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Normal</p>
        <Input variant="Filled" placeholder="Placeholder" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Con label + hint</p>
        <Input variant="Filled" label="Correo electrónico" hint="Usaremos este correo para contactarte." placeholder="tu@email.com" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Inválido</p>
        <Input variant="Filled" label="Correo electrónico" error="El correo no es válido." placeholder="tu@email.com" defaultValue="correo-malo" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Deshabilitado</p>
        <Input variant="Filled" label="Correo electrónico" placeholder="tu@email.com" disabled />
      </div>
    </div>
  ),
};

// ─── UnstyledStates ──────────────────────────────────────────────────────────
export const UnstyledStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 360 }}>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Normal</p>
        <Input unstyled placeholder="Sin estilos" />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Con label + hint</p>
        <Input unstyled label="Campo libre" hint="Sin bordes ni fondo." placeholder="Escribe..." />
      </div>
    </div>
  ),
};

// ─── WithSections ─────────────────────────────────────────────────────────────
export const WithSections: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: 360 }}>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>leftSection</p>
        <Input
          placeholder="Buscar..."
          leftSection={<span style={{ fontSize: "1rem" }}>🔍</span>}
        />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>rightSection</p>
        <Input
          type="password"
          placeholder="Contraseña"
          rightSection={<span style={{ fontSize: "0.75rem", color: "#888" }}>👁</span>}
        />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Ambas secciones</p>
        <Input
          placeholder="$0.00"
          leftSection={<span style={{ fontSize: "0.875rem", color: "#888" }}>$</span>}
          rightSection={<span style={{ fontSize: "0.75rem", color: "#888" }}>USD</span>}
        />
      </div>
      <div>
        <p style={{ marginBottom: "0.25rem", fontSize: "0.75rem", color: "#888" }}>Con label + error + sección</p>
        <Input
          label="URL del sitio"
          error="La URL no es válida."
          leftSection={<span style={{ fontSize: "0.75rem", color: "#888" }}>https://</span>}
          placeholder="tusitio.com"
        />
      </div>
    </div>
  ),
};
