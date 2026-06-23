import type { Meta, StoryObj } from "@storybook/react";
import { useTheme } from "../hooks/useTheme";
import { ThemeContextProvider } from "./ThemeContext";
import { defaultTheme } from "./default-theme";

function ThemeDemo() {
  const { vars } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          background: vars.color("primary", 500),
          color: "white",
          padding: vars.spacing("md"),
          borderRadius: vars.radius("md"),
        }}
      >
        primary-500
      </div>
    </div>
  );
}

const meta = {
  title: "Theme/ThemeProvider",
  component: ThemeContextProvider,
  decorators: [
    (Story) => (
      <ThemeContextProvider value={{ theme: defaultTheme }}>
        <Story />
      </ThemeContextProvider>
    ),
  ],
} satisfies Meta<typeof ThemeContextProvider>;

export default meta;

export const Default: StoryObj = {
  render: () => <ThemeDemo />,
};

/* export const CustomPrimary: StoryObj = {
  render: () => (
    <ThemeContextProvider
      value={{
        theme: {
          colors: {
            primary: {
              50: "#fdf4ff",
              100: "#fae8ff",
              200: "#f5d0fe",
              300: "#f0abfc",
              400: "#e879f9",
              500: "#d946ef",
              600: "#c026d3",
              700: "#a21caf",
              800: "#86198f",
              900: "#701a75",
            },
          },
        },
      }}
    >
      <ThemeDemo />
    </ThemeContextProvider>
  ),
}; */
