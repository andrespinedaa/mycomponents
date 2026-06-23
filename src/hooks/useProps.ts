import type { SupportedComponentConfigs, Theme } from "../theme/";

export type ComponentNames = keyof SupportedComponentConfigs;

export function useProps<Props extends object>(
  componentName: string | undefined,
  theme: Theme,
  props: Props,
  defaultProps?: unknown,
): Props {
  const componentConfig = componentName ? theme.components?.[componentName] : undefined;
  const themeDefaults = (componentConfig?.defaultProps as Partial<Props>) ?? {};

  // Resolve size tokens: theme.components[name].sizes[size] → StyleProps merged before userProps
  const sizeKey = (props as any).size ?? (themeDefaults as any)?.size ?? (defaultProps as any)?.size;
  const sizeProps = (sizeKey && componentConfig?.sizes?.[sizeKey]) ?? {};

  return {
    ...((defaultProps as Partial<Props>) ?? {}),
    ...themeDefaults,
    ...(sizeProps as Partial<Props>),
    ...props,
  } as Props;
}
