import { useProps, useTheme } from ".";
import type { FactoryConfig, RequiredDefaultProps } from "../factory";
import { getMod, getSlots, type ModProps, type SlotProps } from "../system";
import type { PolymorphicPropsConfig } from "../types";

export type ResolvedFactoryProps<Config extends FactoryConfig> = Omit<
  PolymorphicPropsConfig<Config>,
  "mod" | "dataSlot"
> &
  ModProps &
  SlotProps;

export interface UseResolvedPropsReturn<Config extends FactoryConfig> {
  resolvedProps: ResolvedFactoryProps<Config>;
  theme: Theme;
}

export function useResolvedProps<Config extends FactoryConfig>(
  componentName: Config["componentName"],
  props: PolymorphicPropsConfig<Config>,
  defaultProps?: RequiredDefaultProps<Config>,
): UseResolvedPropsReturn<Config> {
  const { theme } = useTheme();
  const merged = useProps(componentName, theme, props, defaultProps);
  const { mod, dataSlot, variant, ...restProps } = merged;
  const modProps = getMod(mod, variant);
  const slotProps = getSlots(dataSlot);

  return {
    theme,
    resolvedProps: {
      ...modProps,
      ...slotProps,
      ...restProps,
    } as ResolvedFactoryProps<Config>,
  };
}
