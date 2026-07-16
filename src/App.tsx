import { Card } from "./components/Card/Card";
import { Badge, DotBadge } from "./components/Badge/Badge";
import { Text } from "./components/Primitives/Text/Text";
import { ThemeProvider } from "./theme";
import { createTheme } from "./theme/createTheme";
import { graphiteTheme, haloTheme } from "./themes";
import { Box, Image } from "./components";
import bgImage from "./components/Card/background 2.jpg";

const theme = createTheme(haloTheme);
const badgeInfo = [{ data: "ice grey" }, { data: "3.2s" }, { data: "Manual" }];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box minH="100vh" p="40px">
        <Card variant="Elevated" >
          <Card.Section section="media" set="cover">
            <Image src={bgImage} set="cover" />
          </Card.Section>
          <Card.Section section="header" as="header" set="bottom">
            {badgeInfo.map((b, i) => {
              return (
                <Badge key={i}>
                  <DotBadge dotColor="success.300" />
                  {b.data}
                </Badge>
              );
            })}
          </Card.Section>
          <Card.Section section="body">
            <Text as="h2" color="neutral.100" fontSize={"3xl"} m={"0"}>
              Porsche 911
            </Text>
            <Text as="h2" color="neutral.100" fontSize={"3xl"} m={"0"}>
              GT3 RS
            </Text>
            <Text color="neutral.100">Timeless, iconic, and unapologetically analog…</Text>
          </Card.Section>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default App;
