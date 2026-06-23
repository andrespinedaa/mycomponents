// factory.types.ts
import type { CSSProperties, ElementType } from "react";
import type { StyleProps } from "../theme/generators/system-css.data";
import type {
  ElementRefType,
  JSXProps,
  PolymorphicComponentProps,
  PolymorphicPropsConfig,
  PolymorphicPropsToOmit,
} from "../types/polimorphic.types";
import type { ComponentVariants } from "../theme/theme.variants";
import type { defaultThemeMacros } from "../theme/theme.macros.data";
import type { BuiltInMacros } from "../theme/theme.macros.types";

// ─── Mod Prop ──────────────────────────────────────────────────────────
export type Mod = Record<string, unknown> | string;

// ─── Css Vars Prop ──────────────────────────────────────────────────────────
export type CSSVars = Record<string, string>;

// ─── Apply Prop ──────────────────────────────────────────────────────────
export type ThemeMacros = typeof defaultThemeMacros;
export type ApplyProp = keyof ThemeMacros | BuiltInMacros;

// ─── BaseProps ──────────────────────────────────────────────────────────────
export type BaseProps = {
  vars?: CSSVars;
  unstyled?: boolean;
  dataSlot?: string;
  mod?: Mod | Mod[];
  renderRoot?: (props: Record<string, unknown>) => React.ReactNode;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  apply?: ApplyProp | ApplyProp[];
  variant?: ComponentVariants;
};

// ─── System Props and BaseProps ──────────────────────────────────────────────────────────────
export type SystemProps = StyleProps & BaseProps;

// ─── Override HtmlAttributes over OwnProps ──────────────────────────────────────────────────────────
//  cuando hay colisión TypeScript intersecta ambas firmas y el resultado es never, OverrideNative — resuelve colisiones, tu OwnProps gana
export type OverrideJsxComponentProps<
  E extends ElementType,
  OwnProps = object,
> = Omit<JSXProps<E>, keyof OwnProps> & OwnProps;

// ─── HtmlProps ──────────────────────────────────────────────────────────
// Atributos HTML del componente Polimorfico, sin SystemProps, StyleProps, AsProp, ref, con OwnProps
export type MyComponentProps<E extends ElementType, OwnProps = object> = Omit<
  OverrideJsxComponentProps<E, OwnProps>,
  keyof SystemProps | PolymorphicPropsToOmit<E>
>;

// ─── Component Stactics ─────────────────────────────────────────────────────────────
export type FactoryStatics = Record<string, React.ComponentType<any>>;
export type EmptyStatics = Record<string, never>;
export type EmptyOwnProps = Record<string, never>;

// ─── React Component Properties ─────────────────────────────────────────────────────────────
// Extrae solo las keys que FunctionComponent realmente tiene
export type ExistingFunctionComponentKeys = Extract<
  "displayName" | "defaultProps" | "propTypes",
  keyof React.FunctionComponent<never>
>;

export type ComponentProperties = Pick<
  React.FunctionComponent<never>,
  ExistingFunctionComponentKeys
>;

// ─── Factory configueration ─────────────────────────────────────────────────────────────
export type FactoryConfig = {
  defaultTag: ElementType;
  ownProps: object;
  statics?: FactoryStatics;
  defaultProps?: object;
  componentName?: string;
};

// ─── ComponentConfig — sin transformación, solo valida ───────────────────────
export type ComponentConfig<Config extends FactoryConfig> = Config;

export type FactoryDefaultPropsDefinition<Config extends FactoryConfig> =
  Partial<Config["ownProps"] & PolymorphicPropsConfig<Config>>;

// ─── Factory Default Props options ─────────────────────────────────────────────────────────────
export type DefaultsPropKeys<Config extends FactoryConfig> = Extract<
  keyof FactoryDefaultPropsDefinition<Config>,
  keyof NonNullable<Config["defaultProps"]>
>;

// ─── Required si declarado en defaultsProps, opcional el resto ────────────────
export type RequiredDefaultProps<Config extends FactoryConfig> = Required<
  Pick<FactoryDefaultPropsDefinition<Config>, DefaultsPropKeys<Config>>
> &
  Partial<
    Omit<FactoryDefaultPropsDefinition<Config>, DefaultsPropKeys<Config>>
  >;

// ─── Render Fuction Render Option ─────────────────────────────────────────────────────────────
export type FactoryRenderFn<Render> = (renderProps: Render) => React.ReactNode;

// ─── Factory Function Options ─────────────────────────────────────────────────────────────
export type FactoryOptions<Config extends FactoryConfig, RenderProps> = {
  ownProps?: Config["ownProps"];
  componentName?: Config["componentName"];
  defaultTag: Config["defaultTag"];
  render?: FactoryRenderFn<RenderProps>;
  statics?: Config["statics"];
  defaultProps?: RequiredDefaultProps<Config>;
};

// ─── Factory Function Component Return ─────────────────────────────────────────────────────────────
export type FactoryComponentReturn<Config extends FactoryConfig> = {
  <E extends ElementType = Config["defaultTag"]>(
    props: PolymorphicComponentProps<E, Config["ownProps"]> &
      React.RefAttributes<ElementRefType<E>>,
  ): React.ReactElement | null;
} & ComponentProperties &
  Config["statics"];
