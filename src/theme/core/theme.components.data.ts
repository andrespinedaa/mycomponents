import type { ThemeComponents } from "..";
import { BadgeThemeComponent } from "../../components/Badge/BadgeTheme";
import { CardSectionThemeComponent } from "../../components/Card/CardSectionTheme";
import { CardThemeComponent } from "../../components/Card/CardTheme";
import { DotThemeComponent } from "../../components/Dot/DotTheme";
import { DividerTheme } from "../../components/Primitives/Divider/DividerTheme";
import { ImageThemeComponent } from "../../components/Primitives/Image/ImageTheme";

export const defaultThemeComponents: ThemeComponents = {
  /*   Alert: AlertThemeComponent,
  
  Input: InputThemeComponent,
  Avatar: AvatarThemeComponent,
  Button: ButtonThemeComponent, */
  Divider: DividerTheme,
  Dot: DotThemeComponent,
  Image: ImageThemeComponent,
  Badge: BadgeThemeComponent,
  Card: CardThemeComponent,
  CardSection: CardSectionThemeComponent,
};
