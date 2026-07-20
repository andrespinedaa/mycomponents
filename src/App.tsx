import { Card, Badge, Dot } from "./components";
import { Text, Box, Image, Divider } from "./components/Primitives";
import { ThemeProvider, useThemeContext } from "./theme";
import { createTheme } from "./theme/createTheme";
import { graphiteTheme, haloTheme } from "./themes";
import bgImage from "./components/Card/background 2.jpg";
import bg2 from "./components/Card/background.jpg";

const theme = createTheme(haloTheme);
const badgeInfo = [{ data: "ice grey" }, { data: "3.2s" }, { data: "Manual" }];

function App() {

  const { sizeResponsive } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <Box minH="100vh" p="40px">
        <Card
          p="sm"
          variant="Outlined"
          orientation="vertical"
          apply={["@flexCenterEnd", "@flexCol"]}
        >
          <Card.Section slots="media" set="cover">
            <Image src={bgImage} set="cover" rounded={sizeResponsive} />
          </Card.Section>
          <Card.Section slots="header" as="header" apply={["@flexEndSpaceAround"]}>
            {badgeInfo.map((b, i) => {
              return (
                <Badge key={i}>
                  <Dot dotColor="success.300" />
                  {b.data}
                </Badge>
              );
            })}
          </Card.Section>
          <Card.Section slots="body" apply={["@flexCol", "@flexStartEnd"]} p="md">
            <Text as="h2" color="neutral.100" fontSize={"3xl"}>
              Porsche 911
            </Text>
            <Text as="h2" color="neutral.100" fontSize={"3xl"}>
              GT3 RS
            </Text>
            <Text color="neutral.100">Timeless, iconic, and unapologetically analog…</Text>
          </Card.Section>
        </Card>
        <Card>
          <Card.Section slots="header" apply={["@pushTop", "@pushLeft"]} p="sm">
            <Badge>
              <Text>🚀</Text>
              <Text>Prime Pick</Text>
            </Badge>
          </Card.Section>
          <Card.Section slots="media" set="cover">
            <Image src={bg2} alt="Walled Sabir" />
          </Card.Section>
          <Card.Section
            slots="body"
            apply="@fadeUp"
            vars={{ "--gradient-from": "primary.500", "--gradient-stop": "60%" }}
            p="sm"
          >
            <Box>
              <Text as="h2" color="#fff">
                List: $250,000
              </Text>
              <Box>
                <Text>Harry Koingsbergstr 1063 AG Guilaume Briard</Text>
                <Box>
                  <Text>29 m2 living</Text>
                  <Divider bg="neutral.500" />
                  <Text>2 Rooms</Text>
                </Box>
              </Box>
            </Box>
            <Card.Section slots="footer">
              <Text>
                By{" "}
                <b>
                  <i>Walled Sabir</i>
                </b>{" "}
                2 days ago
              </Text>
            </Card.Section>
          </Card.Section>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default App;
