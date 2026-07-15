import type { PolymorphicPropsConfig } from "../../types/polimorphic.types";
import type { FactoryConfig, FactoryResolvableProps } from "./factories.types";

// "mod" | "style" | "renderRoot": nunca llegan a render() (se consumen antes o no aplican a un
// render custom). keyof FactoryResolvableProps<Config>: single source of verdad — size/section/set/variant
// se omiten aquí porque su versión resuelta (con defaults + contexto aplicados) llega vía FactoryInternalProps,
// no vía el valor crudo que el consumidor pasó.
export type ResolvedFactoryProps<Config extends FactoryConfig> = Omit<
  PolymorphicPropsConfig<Config>,
  "mod" | "style" | "renderRoot" | keyof FactoryResolvableProps<Config>
>;

export type DefaultableProps<Config extends FactoryConfig> = Partial<
  Omit<PolymorphicPropsConfig<Config>, keyof Config["ownProps"]> & Config["ownProps"]
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
  { [K in keyof Props as K extends keyof Defaults ? K : never]-?: Exclude<Props[K], undefined> };

export type FactoryDefaultPropsConfig<Config extends FactoryConfig> = DefaultProps<
  ResolvedFactoryProps<Config>,
  NonNullable<Config["defaultProps"]>
>;
