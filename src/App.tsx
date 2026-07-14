import { Card } from "./components/Card/Card";
import { Badge } from "./components/Badge/Badge";
import { Text } from "./components/Primitives/Text/Text";
import { Flex } from "./components/Primitives/Flex/Flex";
import { ThemeProvider } from "./theme";
import { createTheme } from "./theme/createTheme";
import { graphiteTheme, haloTheme } from "./themes";
import { Box } from "./components";

const theme = createTheme(haloTheme);

const cards = [
  {
    variant: "Filled" as const,
    badge: "Filled",
    badgeVariant: "Subtle" as const,
    title: "Getting started",
    desc: "Everything you need to build your first component.",
    meta: "5 min read",
    emoji: "📄",
  },
  {
    variant: "Outlined" as const,
    badge: "Outlined",
    badgeVariant: "Outlined" as const,
    title: "Design tokens",
    desc: "Colors, spacing and typography driven by the theme.",
    meta: "8 min read",
    emoji: "🎨",
  },
  {
    variant: "Filled" as const,
    badge: "Filled",
    badgeVariant: "Filled" as const,
    title: "Component factory",
    desc: "One API for every component — polymorphic and typed.",
    meta: "12 min read",
    emoji: "⚡",
  },
  {
    variant: "Elevated" as const,
    badge: "Elevated",
    badgeVariant: "Subtle" as const,
    title: "Theme system",
    desc: "Switch between Graphite, Halo and Terra in one line.",
    meta: "6 min read",
    emoji: "🚀",
  },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        minH="100vh"
        style={{ background: "var(--mycomponents-color-neutral-400, #94a3b8)" }}
        p="40px"
      >

      <Card >
        <Card.Section section="body"/>
      </Card>
      </Box>
    </ThemeProvider>
  );
}

export default App;
