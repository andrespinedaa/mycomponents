import type { ArgTypes } from "@storybook/react";
import type { Theme } from "../theme/core/theme.types";
import { STYLE_PROPS_DATA } from "../theme/generators/system-css.data";
import { getOptions } from "./get-options";

export function createStylePropsArgTypes(theme: Theme): ArgTypes {
  return Object.fromEntries(
    Object.entries(STYLE_PROPS_DATA).map(([key, value]) => {
      const options = getOptions(value.category, theme);
      return [
        key,
        {
          control: {
            type: options ? "select" : "text",
          },
          options,
          description: value.properties.join(", "),
          table: {
            category: value.category,
            type: {
              summary: value.category,
            },
          },
        },
      ];
    }),
  );
}

export function createBasePropsArgTypes(): ArgTypes {
  return {
    as: {
      control: { type: "text" },
      description: "Elemento HTML o componente React a renderizar",
      table: {
        category: "Polimorfismo",
        type: { summary: "ElementType" },
        defaultValue: { summary: "div" },
      },
    },
    children: {
      control: { type: "text" },
      description: "Contenido del componente",
      table: {
        category: "Base",
        type: { summary: "ReactNode" },
      },
    },
    className: {
      control: { type: "text" },
      description: "Clase CSS adicional",
      table: {
        category: "Base",
        type: { summary: "string" },
      },
    },
    slot: {
      control: { type: "text" },
      description: "Identificador de slot — genera data-slot en el DOM",
      table: {
        category: "Base",
        type: { summary: "string" },
      },
    },
    unstyled: {
      control: { type: "boolean" },
      description:
        "Ignora todos los StyleProps — solo aplica style inline y vars",
      table: {
        category: "Base",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    mod: {
      control: { type: "object" },
      description: "Modificadores — generan data-* attributes en el DOM",
      table: {
        category: "Base",
        type: { summary: "ModProp | ModProp[]" },
      },
    },
    vars: {
      control: { type: "object" },
      description: "CSS custom properties inyectadas como style inline",
      table: {
        category: "Base",
        type: { summary: "Record<string, string>" },
      },
    },
    style: {
      control: { type: "object" },
      description: "Style inline — gana sobre StyleProps",
      table: {
        category: "Base",
        type: { summary: "CSSProperties" },
      },
    },
  };
}

export function createSystemPropsArgTypes(theme: Theme): ArgTypes {
  return {
    ...createBasePropsArgTypes(),
    ...createStylePropsArgTypes(theme),
  };
}