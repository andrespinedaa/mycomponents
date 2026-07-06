import type { PropCategory } from "../theme/generators/system-css.types";
import type { Theme } from "../theme/core/theme.types";

export function getOptions(category: PropCategory, theme: Theme) {
  switch (category) {
    case "spacing":
      return [...Object.keys(theme.spacing), "auto", "full", "screen", "fit"];

    case "color":
      return Object.entries(theme.colors).flatMap(([color, shades]) =>
        Object.keys(shades).map((shade) => `${color}.${shade}`),
      );

    case "radius":
      return Object.keys(theme.radii);

    case "fontSize":
      return Object.keys(theme.fontSizes);

    default:
      return undefined;
  }
}
