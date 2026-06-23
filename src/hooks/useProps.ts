import type { SupportedComponentConfigs, Theme } from "../theme/";

export type ComponentNames = keyof SupportedComponentConfigs;

export function useProps<Props extends object>(
  componentName: string | undefined,
  theme: Theme,
  props: Props,
  defaultProps?: unknown,
): Props {
  const themeDefaults = componentName
    ? (theme.components?.[componentName]?.defaultProps as Partial<Props>) ?? {}
    : {};

  return {
    ...((defaultProps as Partial<Props>) ?? {}),
    ...themeDefaults,
    ...props,
  } as Props;
}
