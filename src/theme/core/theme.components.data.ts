import type { ThemeComponents } from "..";
import { AlertThemeComponent } from "../../components/Alert/AlertTheme";
import { AvatarThemeComponent } from "../../components/Avatar/AvatarTheme";
import { BadgeThemeComponent } from "../../components/Badge/BadgeTheme";
import { ButtonThemeComponent } from "../../components/Button/ButtonTheme";
import { CardThemeComponent } from "../../components/Card/CardTheme";
import { CardSectionThemeComponent } from "../../components/Card/CardSectionTheme";
import { InputThemeComponent } from "../../components/Input/InputTheme";
import { DotBadgeThemeComponent } from "../../components/Badge/DotBadgeTheme";
import { ImageThemeComponent } from "../../components/Primitives/Image/ImageTheme";

export const defaultThemeComponents: ThemeComponents = {
  /*   Alert: AlertThemeComponent,
  
  Input: InputThemeComponent,
  Avatar: AvatarThemeComponent,
  Button: ButtonThemeComponent, */
  DotBadge: DotBadgeThemeComponent,
  Image: ImageThemeComponent,
  Badge: BadgeThemeComponent,
  Card: CardThemeComponent,
  CardSection: CardSectionThemeComponent,
};
