import { Box } from "./components/Box";
import { Button } from "./components/Button/Button";
import { ThemeProvider } from "./theme";
import { createTheme } from "./utils/createTheme";

const theme = createTheme({
  fontSizes: {
    lg: "100px",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        minW="100px"
        maxW="500px"
        display="flex"
        align="center"
        justify="space-between"
        boxShadow={"10px 10px 15px rgba(0,0,0,0.2)"}
        rounded={"md"}
        p={"md"}
      >
        <Box
          w="50px"
          h="50px"
          bg={"neutral.200"}
          display="flex"
          align="center"
          justify="center"
          rounded={"md"}
          as="div"
        >
          box
        </Box>
        <Box
          w="50px"
          h="50px"
          bg={"neutral.200"}
          display="flex"
          align="center"
          justify="center"
          rounded={"md"}
        >
          box
        </Box>
        <Box
          w="50px"
          h="50px"
          bg={"neutral.200"}
          display="flex"
          align="center"
          justify="center"
          rounded={"md"}
        >
          box
        </Box>
        <Box
          w="50px"
          h="50px"
          bg={"neutral.200"}
          display="flex"
          align="center"
          justify="center"
          rounded={"md"}
        >
          box
        </Box>
        <Box as="div">Button</Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
