import type { Theme, CategoryTokens } from "../theme/theme.types";
import { SIZE_ALIASES } from "../factory/resolvers/resolve-value";

export function getOptions(category: keyof CategoryTokens, theme: Theme) {
  switch (category) {
    case "spacing":
      return [...Object.keys(theme.spacing), ...Object.keys(SIZE_ALIASES)];

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
