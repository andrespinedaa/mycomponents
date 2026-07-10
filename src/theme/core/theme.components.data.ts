import type { ThemeComponents } from "..";
import { AlertThemeComponent } from "../../components/Alert/AlertTheme";
import { AvatarThemeComponent } from "../../components/Avatar/AvatarTheme";
import { BadgeThemeComponent } from "../../components/Badge/BadgeTheme";
import { ButtonThemeComponent } from "../../components/Button/ButtonTheme";
import { CardThemeComponent } from "../../components/Card/CardTheme";
import { InputThemeComponent } from "../../components/Input/InputTheme";

export const defaultThemeComponents: ThemeComponents = {
  /* Primitives */
  Box: {},
  Text: {},
  Divider: {},
  Grid: {},
  Image: {},
  Flex: {
    defaultProps: { display: "flex", h: "" },
    sizes: {
      lg: { h: "100%", w: "100%" },
    },
  },
  Stack: {},

  /* Components */
  Alert: AlertThemeComponent,
  Badge: BadgeThemeComponent,
  Input: InputThemeComponent,
  Avatar: AvatarThemeComponent,
  Button: ButtonThemeComponent,
  Card: CardThemeComponent,
};
