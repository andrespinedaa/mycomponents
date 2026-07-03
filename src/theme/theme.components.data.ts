import type { ThemeComponents } from ".";
import { AlertThemeComponent } from "../components/Alert/AlertTheme";
import { AvatarThemeComponent } from "../components/Avatar/AvatarTheme";
import { BadgeThemeComponent } from "../components/Badge/BadgeTheme";
import { ButtonThemeComponent } from "../components/Button/ButtonTheme";
import { CardThemeComponent } from "../components/Card/CardTheme";
import { CardSectionThemeComponent } from "../components/Card/CardSectionTheme";
import { InputThemeComponent } from "../components/Input/InputTheme";

export const defaultThemeComponents: ThemeComponents = {
  /* Primitives */
  Box: { prefix: "box" },
  Text: { prefix: "text" },
  Divider: { prefix: "divider" },
  Grid: { prefix: "grid" },
  Image: { prefix: "image" },
  Flex: {
    prefix: "flex",
    defaultProps: { display: "flex", h: "" },
    sizes: {
      lg: { h: "100%", w: "100%" },
    },
  },
  Stack: {
    prefix: "stack",
    defaultProps: { display: "flex", flexDir: "column" },
  },

  /* Components */
  Alert: AlertThemeComponent,
  Badge: BadgeThemeComponent,
  Input: InputThemeComponent,
  Avatar: AvatarThemeComponent,
  Button: ButtonThemeComponent,
  Card: CardThemeComponent,
  CardSection: CardSectionThemeComponent,
};
