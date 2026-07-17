import type { Macros } from "./theme.macros.types";
import { layoutMacros } from "./layout.macros";
import { positionMacros } from "./position.macros";
import { typographyMacros } from "./typography.macros";
import { gradientMacros } from "./gradient.macros";
import { resetMacros } from "./reset.macros";
import { dividerMacros } from "./divider.macros";

export * from "./layout.macros";
export * from "./position.macros";
export * from "./typography.macros";
export * from "./gradient.macros";
export * from "./reset.macros";
export * from "./divider.macros";

export const FLEX_DISPLAYS = ["flex", "inlineFlex"] as const;

export const GRID_DISPLAYS = ["grid", "inlineGrid"] as const;

export const JUSTIFY_CONTENTS = [
  "Normal",
  "Stretch",
  "Center",
  "Start",
  "End",
  "FlexStart",
  "FlexEnd",
  "Left",
  "Right",
  "SpaceBetween",
  "SpaceAround",
  "SpaceEvenly",
  "SafeCenter",
  "UnsafeCenter",
] as const;

export const JUSTIFY_ITEMS = [
  "Start",
  "End",
  "Center",
  "Stretch",
  "Legacy",
  "Left",
  "Right",
  "SelfStart",
  "SelfEnd",
] as const;

export const ALIGNS = [
  "Normal",
  "Stretch",
  "Center",
  "Start",
  "End",
  "FlexStart",
  "FlexEnd",
  "SelfStart",
  "SelfEnd",
  "Baseline",
  "FirstBaseline",
  "LastBaseline",
  "SafeCenter",
  "UnsafeCenter",
] as const;

export const defaultThemeMacros = {
  ...layoutMacros,
  ...positionMacros,
  ...typographyMacros,
  ...gradientMacros,
  ...resetMacros,
  ...dividerMacros,
} satisfies Macros;
