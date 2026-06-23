import type { CSSProperties } from "react";
import type {
  ALIGNS,
  FLEX_DISPLAYS,
  GRID_DISPLAYS,
  JUSTIFY_CONTENTS,
  JUSTIFY_ITEMS,
} from "./theme.macros.data";

export type Flex = (typeof FLEX_DISPLAYS)[number];

export type Align = (typeof ALIGNS)[number];

export type JustifyContent = (typeof JUSTIFY_CONTENTS)[number];

export type JustifyItem = (typeof JUSTIFY_ITEMS)[number];

export type GridDisplay = (typeof GRID_DISPLAYS)[number];

export type FlexMacros = `@${Flex}${Align}${JustifyContent}`;

export type GridMacros = `@${GridDisplay}${Align}${JustifyItem}`;

export type BuiltInMacros = FlexMacros | GridMacros;

export type Macros = Record<`@${string}`, CSSProperties>;
