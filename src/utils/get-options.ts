import type { Theme, CategoryTokens } from "../theme/core/theme.types";

export function getOptions(category: CategoryTokens, theme: Theme) {
  switch (category) {
    case "spacing":
      return [...Object.keys(theme.spacing), "auto", "full", "screen", "fit"];

    case "colors":
      return Object.entries(theme.colors).flatMap(([color, shades]) =>
        Object.keys(shades).map((shade) => `${color}.${shade}`),
      );

    case "radius":
      return Object.keys(theme.radius);

    case "fontSizes":
      return Object.keys(theme.fontSizes);

    case "shadow":
      return Object.keys(theme.shadow);

    default:
      return undefined;
  }
}
