import { useProps, useTheme } from ".";
import { useComponentCSS } from "./useComponentCSS";
import type { FactoryConfig, HooksOf, RequiredDefaultProps } from "../factory";
import { getMod, type ModProps } from "../system";
import type { Theme } from "../theme/theme.types";
import type { PolymorphicPropsConfig, SizeProp } from "../types";

export type ResolvedFactoryProps<Config extends FactoryConfig> = Omit<
  PolymorphicPropsConfig<Config>,
  "mod" | "dataSlot" | "size"
> &
  ModProps;

export interface UseResolvedPropsReturn<Config extends FactoryConfig> {
  resolvedProps: ResolvedFactoryProps<Config>;
  size: Config["sizes"];
  theme: Theme;
  hooks: HooksOf<Config>;
}

export function useResolvedProps<Config extends FactoryConfig>(
  componentName: Config["componentName"],
  props: PolymorphicPropsConfig<Config>,
  defaultProps?: RequiredDefaultProps<Config>,
  useHooks?: () => HooksOf<Config>,
): UseResolvedPropsReturn<Config> {
  const { theme: themeCtx } = useTheme();
  useComponentCSS(componentName, themeCtx);
  const merged = useProps(componentName, themeCtx, props, defaultProps);
  const { mod, dataSlot, variant, size, hooks, theme, ...restProps } = merged;
  const dataName = dataSlot ?? componentName;
  const resolvedMods = getMod([
    mod,
    variant && { variant },
    dataName && { slot: dataName },
    size && { size },
  ]);
  const resolvedHooks = (useHooks ?? (() => ({} as HooksOf<Config>)))();

  return {
    theme: themeCtx,
    hooks: resolvedHooks,
    size: size as Config["sizes"],
    resolvedProps: {
      ...resolvedMods,
      ...restProps,
    } as ResolvedFactoryProps<Config>,
  };
}
