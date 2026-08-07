import type { Theme } from "../theme.types";

export function getSortedBreakpoints(theme: Theme): Array<[string, string]> {
  return Object.entries(theme.breakpoints).sort(([, a], [, b]) => parseInt(a) - parseInt(b));
}

export function getSmallestBreakpoint(theme: Theme): string {
  return getSortedBreakpoints(theme)[0]![0];
}
