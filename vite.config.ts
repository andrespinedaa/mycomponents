/// <reference types="vitest/config" />
// https://vite.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import dts from "vite-plugin-dts";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    process.env.NODE_ENV === "production" && dts({ insertTypesEntry: true }),
  ].filter(Boolean),

  build: {
    lib: {
      entry: resolve(dirname, "src/index.ts"),
      name: "MyComponents",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: [
        {
          format: "es",
          entryFileNames: "index.esm.js",
        },
        {
          format: "cjs",
          entryFileNames: "index.cjs.js",
        },
      ],
    },
  },

  test: {
    ui: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.test.*", "src/**/*.stories.*", "src/test/**"],
    },

    projects: [
      // Proyecto 1 — tests unitarios con jsdom
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
          setupFiles: ["./src/test/setup.ts"],
        },
      },
      // Proyecto 2 — storybook con browser
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          environment: "happy-dom",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },

  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
