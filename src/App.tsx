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
    variant: "Default" as const,
    badge: "Default",
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
        {/* Header */}
        <Flex flexDir="column" gap="4px" mb="32px">
          <Text
            as="h1"
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "var(--mycomponents-color-text)",
            }}
          >
            MyComponents
          </Text>
          <Text
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--mycomponents-color-text-subtle)",
            }}
          >
            Graphite theme — card variants
          </Text>
        </Flex>

        {/* Cards grid */}
        <Flex gap="16px" flexWrap="wrap">
          {cards.map(
            ({ variant, badge, badgeVariant, title, desc, meta, emoji }) => (
              <Card key={variant} variant={variant} orientation="vertical">
                <Card.Section
                  section="header"
                  apply={"@flexCenterSpaceBetween"}
                >
                  <Badge variant={badgeVariant} size="sm">
                    {badge}
                  </Badge>
                  <Text
                    as="span"
                    style={{
                      fontSize: 11,
                      color: "var(--mycomponents-color-text-subtle)",
                    }}
                  >
                    {meta}
                  </Text>
                </Card.Section>

                <Card.Section
                  section="media"
                  rounded="md"
                  style={{
                    height: 80,
                    background: "var(--mycomponents-color-primary-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  {emoji}
                </Card.Section>

                <Card.Section section="body">
                  <Flex flexDir="column" gap="4px">
                    <Text
                      as="h3"
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--mycomponents-color-text)",
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      as="p"
                      style={{
                        margin: 0,
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: "var(--mycomponents-color-text-subtle)",
                      }}
                    >
                      {desc}
                    </Text>
                  </Flex>
                </Card.Section>
              </Card>
            ),
          )}
        </Flex>
      </Box>
    </ThemeProvider>
  );
}

export default App;
