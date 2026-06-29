import type { Theme } from "../theme/";

export function useProps<Props extends object>(
  componentName: string | undefined,
  theme: Theme,
  props: Props,
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
