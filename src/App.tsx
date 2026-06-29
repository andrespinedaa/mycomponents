import { Card } from "./components/Card/Card";
import { ThemeProvider } from "./theme";
import { createTheme } from "./theme/createTheme";
import { graphiteTheme } from "./themes";

const theme = createTheme(graphiteTheme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Card w={"320px"} h={"320px"}></Card>
    </ThemeProvider>
  );
}

export default App;
