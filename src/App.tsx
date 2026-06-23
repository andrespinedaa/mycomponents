import { Card } from "./components/Card/Card";
import { ThemeProvider } from "./theme";
import { createTheme } from "./theme/createTheme";

const theme = createTheme({
  fontSizes: {
    lg: "100px",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Card w={"320px"} h={"320px"}></Card>
    </ThemeProvider>
  );
}

export default App;
