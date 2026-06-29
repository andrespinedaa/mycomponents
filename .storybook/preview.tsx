import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/theme";
import { graphiteTheme } from "../src/themes/graphite";
import { haloTheme } from "../src/themes/halo";
import { terraTheme } from "../src/themes/terra";
import { createTheme } from "../src/theme/createTheme";

const THEMES = {
  graphite: createTheme(graphiteTheme),
  halo:     createTheme(haloTheme),
  terra:    createTheme(terraTheme),
} as const;

type ThemeKey = keyof typeof THEMES;

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "graphite", title: "Graphite" },
          { value: "halo",     title: "Halo"     },
          { value: "terra",    title: "Terra"     },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: "graphite",
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },

  decorators: [
    (Story, context) => {
      const key = (context.globals.theme ?? "graphite") as ThemeKey;
      const theme = THEMES[key] ?? THEMES.graphite;
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
