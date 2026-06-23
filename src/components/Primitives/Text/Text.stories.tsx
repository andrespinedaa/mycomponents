import type { Meta, StoryObj } from "@storybook/react";
import { defaultTheme } from "../../../theme";
import { createSystemPropsArgTypes } from "../../../utils/createStylePropsArgTypes";
import { Text } from "./Text";

const meta = {
  title: "Primitives/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: createSystemPropsArgTypes(defaultTheme),
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "un texto aqui",
  },
};

export const Truncate: Story = {
  args: {
    children:
      "Este es un texto extremadamente largo diseñado para demostrar cómo funciona la macro truncate cuando el contenido excede el ancho disponible del contenedor.",
    apply: ["@truncate"],
    w: "250px",
  },
};

export const LineClamp2: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at velit bibendum posuere. Suspendisse potenti. Sed malesuada, arcu eget egestas pulvinar, mauris nunc aliquet lorem, vitae vulputate purus nunc nec justo.",
    apply: ["@lineClamp"],
    w: "250px",
  },
};

export const LineClamp3: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel magna at velit bibendum posuere. Suspendisse potenti. Sed malesuada, arcu eget egestas pulvinar, mauris nunc aliquet lorem, vitae vulputate purus nunc nec justo.",
    apply: ["@lineClamp"],
    w: "250px",
  },
};

export const Inherit: Story = {
  render: () => (
    <div
      style={{
        fontSize: "32px",
        fontWeight: 700,
        color: "tomato",
      }}
    >
      <Text apply={["@inherit"]}>
        Este texto debería heredar los estilos del padre
      </Text>
    </div>
  ),
};
