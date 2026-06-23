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

export function useResolvedProps<Config extends FactoryConfig>(
  componentName: Config["componentName"],
  props: PolymorphicPropsConfig<Config>,
  defaultProps?: RequiredDefaultProps<Config>,
): ResolvedFactoryProps<Config> {
  const { theme } = useTheme();
  const resolvedProps = useProps(componentName, theme, props, defaultProps);
  const { mod, dataSlot, variant, ...restProps } = resolvedProps;
  const modProps = getMod(mod, variant);
  const slotProps = getSlots(dataSlot);

  return {
    ...modProps,
    ...slotProps,
    ...restProps,
  } as ResolvedFactoryProps<Config>;
}
