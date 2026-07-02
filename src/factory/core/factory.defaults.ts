import type { ModProps } from "../../system/get-mod";
import type { PolymorphicPropsConfig } from "../../types/polimorphic.types";
import type { FactoryConfig } from "./factories.types";

export type ResolvedFactoryProps<Config extends FactoryConfig> = Omit<
  PolymorphicPropsConfig<Config>,
  "mod" | "dataSlot" | "size" | "style"
> &
  ModProps;

export type DefaultableProps<Config extends FactoryConfig> = Partial<
  Omit<PolymorphicPropsConfig<Config>, keyof Config["ownProps"]> &
    Config["ownProps"]
>;

export type DefaultsPropKeys<Config extends FactoryConfig> = Extract<
  keyof DefaultableProps<Config>,
  keyof NonNullable<Config["defaultProps"]>
>;

export type RequiredDefaultProps<Config extends FactoryConfig> = Required<
  Pick<DefaultableProps<Config>, DefaultsPropKeys<Config>>
> &
  Partial<Omit<DefaultableProps<Config>, DefaultsPropKeys<Config>>>;

export type DefaultProps<Props, Defaults> = Omit<Props, keyof Defaults> &
  Required<Pick<Props, keyof Defaults & keyof Props>>;

export type FactoryDefaultPropsConfig<Config extends FactoryConfig> =
  DefaultProps<
    ResolvedFactoryProps<Config>,
    NonNullable<Config["defaultProps"]>
  >;
