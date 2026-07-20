import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./ThemeProvider";
import { createTheme } from "./createTheme";
import { graphiteTheme, haloTheme, terraTheme } from "../themes";
import { Box, Button, Badge, Card, Text } from "../components";

const themes = [
  { key: "graphite", label: "Graphite", theme: createTheme(graphiteTheme) },
  { key: "halo", label: "Halo", theme: createTheme(haloTheme) },
  { key: "terra", label: "Terra", theme: createTheme(terraTheme) },
] as const;

function ThemePreview({ label, theme }: { label: string; theme: ReturnType<typeof createTheme> }) {
  return (
    <ThemeProvider theme={theme}>
      <Box flexDir="column" gap="12px" p="16px" style={{ minWidth: 240, flex: 1 }}>
        <Text as="h3" fontWeight="700px" fontSize="13px" color="var(--mycomponents-color-text)">
          {label}
        </Text>

        <Box gap="8px" flexWrap="wrap">
          <Button size="sm">Filled</Button>
          <Button size="sm" variant="Outlined">Outlined</Button>
          <Button size="sm" variant="Ghost">Ghost</Button>
        </Box>

        <Box gap="6px">
          <Badge>Default</Badge>
          <Badge variant="Subtle">Subtle</Badge>
          <Badge variant="Outlined">Outlined</Badge>
        </Box>

        <Card p="0" style={{ overflow: "hidden" }}>
          <Box flexDir="column" gap="4px" p="12px">
            <Text as="p" fontWeight="600px" fontSize="13px">Card title</Text>
            <Text as="p" fontSize="12px" color="var(--mycomponents-color-text-subtle)">
              Card description text
            </Text>
          </Box>
        </Card>

        <Box gap="6px">
          {(["primary", "secondary", "danger", "success"] as const).map((color) => (
            <div
              key={color}
              title={color}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: `var(--mycomponents-color-${color}-500)`,
              }}
            />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const meta = {
  title: "Theme/ThemeProvider",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

export const AllThemes: StoryObj = {
  name: "Side by side",
  decorators: [(Story) => <Story />],
  render: () => (
    <Box
      gap="0"
      style={{
        minHeight: "100vh",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      {themes.map(({ key, label, theme }) => (
        <div
          key={key}
          style={{
            flex: 1,
            borderRight: "1px solid #e5e5e5",
            background: "var(--mycomponents-color-background, #fff)",
          }}
        >
          <ThemePreview label={label} theme={theme} />
        </div>
      ))}
    </Box>
  ),
};

export const Graphite: StoryObj = {
  decorators: [(Story) => <ThemeProvider theme={createTheme(graphiteTheme)}><Story /></ThemeProvider>],
  render: () => <ThemePreview label="Graphite" theme={createTheme(graphiteTheme)} />,
};

export const Halo: StoryObj = {
  decorators: [(Story) => <ThemeProvider theme={createTheme(haloTheme)}><Story /></ThemeProvider>],
  render: () => <ThemePreview label="Halo" theme={createTheme(haloTheme)} />,
};

export const Terra: StoryObj = {
  decorators: [(Story) => <ThemeProvider theme={createTheme(terraTheme)}><Story /></ThemeProvider>],
  render: () => <ThemePreview label="Terra" theme={createTheme(terraTheme)} />,
};
