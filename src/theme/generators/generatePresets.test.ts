import { describe, expect, it } from "vitest";
import { defaultTheme } from "../../themes/default-theme";
import type { Theme } from "../core/theme.types";
import { generateComponentPresets } from "./generatePresets";

type TestConfig = Partial<NonNullable<Theme["components"]>[string]>;

// --- generateComponentPresets --------------------------------------------------

describe("generateComponentPresets", () => {
  describe("preset plano — nivel componente", () => {
    it("genera [data-slot][data-set] con los tokens del preset como CSS vars", () => {
      const config: TestConfig = {
        presets: { cover: { objectFit: "cover", display: "block" } as any },
      };
      const result = generateComponentPresets("Image", config, defaultTheme);
      expect(result).toContain(
        `[data-slot="Image"][data-set="cover"]{--image-object-fit:cover;--image-display:block;}`,
      );
    });

    it("omite presets con tokens vacíos", () => {
      const config: TestConfig = { presets: { empty: {} } };
      const result = generateComponentPresets("Card", config, defaultTheme);
      expect(result).not.toContain(`[data-set="empty"]`);
    });
  });

  describe("preset con orientation — nivel componente", () => {
    it("genera selector compuesto [data-set][data-orientation] por cada orientation declarada", () => {
      const config: TestConfig = {
        presets: {
          background: {
            backgroundSize: "cover",
            orientation: {
              vertical: { backgroundPosition: "center top" },
              horizontal: { backgroundPosition: "center right" },
            },
          } as any,
        },
      };
      const result = generateComponentPresets("Card", config, defaultTheme);

      // flat compartido — sin orientation
      expect(result).toContain(`[data-slot="Card"][data-set="background"]{--card-background-size:cover;}`);
      // overrides por orientation — compuestos con el selector del preset
      expect(result).toContain(
        `[data-slot="Card"][data-set="background"][data-orientation="vertical"]{--card-background-position:center top;}`,
      );
      expect(result).toContain(
        `[data-slot="Card"][data-set="background"][data-orientation="horizontal"]{--card-background-position:center right;}`,
      );
    });

    it("la key 'orientation' nunca se interpreta como token CSS", () => {
      const config: TestConfig = {
        presets: {
          background: {
            orientation: { vertical: { color: "red" } },
          } as any,
        },
      };
      const result = generateComponentPresets("Card", config, defaultTheme);
      expect(result).not.toContain(`--card-orientation:`);
    });

    it("preset sin flat compartido, solo orientation, no genera selector base vacío", () => {
      const config: TestConfig = {
        presets: {
          background: {
            orientation: { vertical: { color: "red" } },
          } as any,
        },
      };
      const result = generateComponentPresets("Card", config, defaultTheme);
      expect(result).not.toContain(`[data-set="background"]{}`);
      expect(result).toContain(
        `[data-set="background"][data-orientation="vertical"]{--card-color:red;}`,
      );
    });
  });

  describe("preset con orientation — nivel slot", () => {
    it("genera [data-slot][data-slots][data-set][data-orientation]", () => {
      const config: TestConfig = {
        parentName: "Card",
        slots: {
          media: {
            presets: {
              background: {
                objectFit: "cover",
                orientation: {
                  vertical: { aspectRatio: "3/4" },
                  horizontal: { aspectRatio: "16/9" },
                },
              } as any,
            },
          },
        } as any,
      };
      const result = generateComponentPresets("CardSection", config, defaultTheme);

      expect(result).toContain(
        `[data-slot="CardSection"][data-slots="media"][data-set="background"]{--card-slots-object-fit:cover;}`,
      );
      expect(result).toContain(
        `[data-slot="CardSection"][data-slots="media"][data-set="background"][data-orientation="vertical"]{--card-slots-aspect-ratio:3/4;}`,
      );
      expect(result).toContain(
        `[data-slot="CardSection"][data-slots="media"][data-set="background"][data-orientation="horizontal"]{--card-slots-aspect-ratio:16/9;}`,
      );
    });
  });
});
