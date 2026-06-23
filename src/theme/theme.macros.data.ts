import type { Macros } from "./theme.macros.types";

export const defaultThemeMacros = {
  // Layout comunes
  "@flexCenter": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "@flexBetween": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  "@flexCol": {
    display: "flex",
    flexDirection: "column",
  },
  "@flexColCenter": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // Posicionamiento
  "@absoluteFill": {
    position: "absolute",
    inset: 0,
  },
  "@fixedFill": {
    position: "fixed",
    inset: 0,
  },

  // Tipografía
  "@lineClamp": {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  },

  "@inherit": {
    font: "inherit",
    color: "inherit",
    lineHeight: "inherit",
    textAlign: "inherit",
  },

  "@inheritAll": {
    all: "inherit",
  },

  "@truncate": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  "@srOnly": {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Macros;

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
