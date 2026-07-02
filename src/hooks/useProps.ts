import type { Theme } from "../theme/";

export function useProps<Props extends object>(
  theme: Theme,
  props: Props,
  componentName?: string,
  defaultProps?: unknown,
): Props {
  const componentConfig = componentName
    ? theme.components?.[componentName]
    : undefined;
  const themeDefaults = (componentConfig?.defaultProps as Partial<Props>) ?? {};

  return {
    ...((defaultProps as Partial<Props>) ?? {}),
    ...themeDefaults,
    ...props,
  } as Props;
}
