import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./ThemeProvider";
import { createTheme } from "./createTheme";
import { graphiteTheme } from "../themes/graphite";
import { haloTheme } from "../themes/halo";
import { terraTheme } from "../themes/terra";
import { Button } from "../components/Button/Button";
import { Badge } from "../components/Badge/Badge";
import { Card } from "../components/Card/Card";
import { Text } from "../components/Primitives/Text/Text";
import { Flex } from "../components/Primitives/Flex/Flex";

const themes = [
  { key: "graphite", label: "Graphite", theme: createTheme(graphiteTheme) },
  { key: "halo",     label: "Halo",     theme: createTheme(haloTheme)     },
  { key: "terra",    label: "Terra",     theme: createTheme(terraTheme)    },
] as const;

function ThemePreview({ label, theme }: { label: string; theme: ReturnType<typeof createTheme> }) {
  return (
    <ThemeProvider theme={theme}>
      <Flex flexDir="column" gap="12px" p="16px" style={{ minWidth: 240, flex: 1 }}>
        <Text as="h3" weight={700} fontSize="13px" color="var(--mycomponents-color-text)">
          {label}
        </Text>

        <Flex gap="8px" flexWrap="wrap">
          <Button size="sm">Filled</Button>
          <Button size="sm" variant="Outlined">Outlined</Button>
          <Button size="sm" variant="Ghost">Ghost</Button>
        </Flex>

        <Flex gap="6px">
          <Badge>Default</Badge>
          <Badge variant="Subtle">Subtle</Badge>
          <Badge variant="Outlined">Outlined</Badge>
        </Flex>

        <Card p="0" style={{ overflow: "hidden" }}>
          <Flex flexDir="column" gap="4px" p="12px">
            <Text as="p" weight={600} fontSize="13px">Card title</Text>
            <Text as="p" fontSize="12px" color="var(--mycomponents-color-text-subtle)">
              Card description text
            </Text>
          </Flex>
        </Card>

        <Flex gap="6px">
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
        </Flex>
      </Flex>
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
    <Flex
      gap="0"
      style={{
        minHeight: "100vh",
        borderTop: "1px solid #e5e5e5",
        divide: "x",
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
    </Flex>
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
