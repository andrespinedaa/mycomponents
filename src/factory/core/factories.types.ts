import type { ElementType } from "react";
import type { LayoutContextValue } from "../../context/LayoutContext";
import type { ModProps } from "../../system/get-mod";
import type {
  BuiltInMacros,
  ComponentVariants,
  Scales,
  StyleProps,
  SystemCSS,
  Theme,
  ThemeBreakpoints,
  ThemeMacros,
} from "../../theme";
import type { PolymorphicRef } from "../../types/polimorphic.types";
import type { DefaultProps, FactoryDefaultPropsConfig } from "./factory.defaults";
import type { FactoryFunctionOptions } from "./factory.render";
import type { Unpack } from "../../types";

export type VarsProp = Record<string, string>;
export type ModProp = Record<string, unknown> | string;
export type OrientationProp = "horizontal" | "vertical";
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;
export type StyleProp = SystemCSS | ((theme: Theme) => SystemCSS);

export type BaseProps = {
  "data-slot"?: string;
  vars?: VarsProp;
  unstyled?: boolean;
  dataSlot?: string;
  mod?: ModProp | ModProp[];
  className?: string;
  style?: StyleProp;
  children?: React.ReactNode;
  apply?: ApplyProp | ApplyProp[];
  orientation?: OrientationProp;
};

export type SystemProps = StyleProps & BaseProps;
export type FactoryStatics = Record<string, React.ComponentType<any>>;

export type FactoryConfig = {
  sizes: keyof ThemeBreakpoints | Scales;
  ownProps: object;
  presets?: string;
  defaultProps: object;
  componentName: string;
  statics?: FactoryStatics;
  defaultTag: ElementType;
  variants?: ComponentVariants;
  sections?: Record<string, string>;
};

type SectionSets<Config extends FactoryConfig> =
  NonNullable<Config["sections"]>[keyof NonNullable<Config["sections"]>];

export type ComponentConfig<Config extends FactoryConfig> = Config;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── PÚBLICAS ── el consumidor SÍ puede escribirlas en JSX (<Card size="md" ... />) ───────
// ════════════════════════════════════════════════════════════════════════════════════════

export type SizeProp<Config extends FactoryConfig> = {
  size?: Config["sizes"];
};

export type SectionProp<Config extends FactoryConfig> = {
  section?: Unpack<keyof Config["sections"]>;
};

export type SetProp<Config extends FactoryConfig> = {
  set?: Unpack<Config["presets"] | SectionSets<Config>>;
};

export type VariantProp<Config extends FactoryConfig> = {
  variant?: Config["variants"];
};

// Props que renderRoot recibe — element-agnosticas para poder spreadearse en cualquier elemento.
export type RenderRootPayload<Config extends FactoryConfig> = Omit<
  React.HTMLAttributes<HTMLElement>,
  "translate"
> &
  ModProps &
  Config["ownProps"] &
  SizeProp<Config> &
  SectionProp<Config> &
  SetProp<Config> &
  VariantProp<Config> & {
    ref?: React.Ref<any>;
    vars?: VarsProp;
    layoutCtx: LayoutContextValue;
  };

export type RenderRootProp<Config extends FactoryConfig> = {
  renderRoot?: (props: RenderRootPayload<Config>) => React.ReactNode;
};

// Superficie pública Config-dependiente — lo que PolymorphicPropsConfig expone al consumidor
// (sumado a PolymorphicComponentProps/SystemProps, que son públicas pero no dependen de Config).
export type ConfigProps<Config extends FactoryConfig> = SizeProp<Config> &
  SectionProp<Config> &
  SetProp<Config> &
  VariantProp<Config> &
  RenderRootProp<Config>;

// ════════════════════════════════════════════════════════════════════════════════════════
// ─── NO PÚBLICAS ── viajan dentro del objeto de props, el consumidor NUNCA debe escribirlas ─
// ════════════════════════════════════════════════════════════════════════════════════════

// Computadas por el factory (typedRef, useMemo) — siempre presentes, nunca defaulteables por el
// autor del componente. Pasarlas por DefaultProps sería un no-op: ya nacen requeridas.
//
// `ref` vive acá conceptualmente (el factory también la "computa") pero NO entra en
// NonPublicProps: viaja por el canal de forwardRef (ver typedRef.ts), nunca dentro del objeto de
// props, así que no tiene el mismo vector de fuga y no necesita la protección de abajo.
export type FactoryComputedProps<Config extends FactoryConfig> = {
  ref: PolymorphicRef<Config["defaultTag"]>;
  layoutCtx: LayoutContextValue;
};

// Suscripción única de campos no-públicos que SÍ viajan por el objeto de props — por lo tanto
// pueden filtrarse vía ...rest desde un ancestro sin `render` propio (ver ComponentFactory.tsx).
// Agregar un campo nuevo aquí (no en cada sitio de uso) es lo único que hace falta para que
// PolymorphicPropsConfig lo reconozca y el factory pueda destructurarlo sin castear.
export type NonPublicProps<Config extends FactoryConfig> = Partial<
  Pick<FactoryComputedProps<Config>, "layoutCtx">
>;

// Resueltas por defaultProps + useResolveLayout (own ?? layoutContext ?? responsive) — opcionales
// salvo que el componente declare un default, en cuyo caso DefaultProps las vuelve requeridas.
export type FactoryResolvableProps<Config extends FactoryConfig> = {
  size?: Config["sizes"];
  variant?: Config["variants"];
  section?: Unpack<keyof Config["sections"]>;
  set?: Unpack<Config["presets"] | SectionSets<Config>>;
};

export type FactoryInternalProps<Config extends FactoryConfig> = FactoryComputedProps<Config> &
  DefaultProps<FactoryResolvableProps<Config>, NonNullable<Config["defaultProps"]>>;

export type FactoryRenderProps<Config extends FactoryConfig> = FactoryDefaultPropsConfig<Config> &
  FactoryInternalProps<Config>;

export type ComponentFactoryOptions<Config extends FactoryConfig> = FactoryFunctionOptions<
  Config,
  FactoryRenderProps<Config>
>;
