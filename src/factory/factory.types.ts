// factory.types.ts
import type { CSSProperties, ElementType } from "react";
import type { StyleProps } from "../system/style-props.types";
import type {
  JSXProps,
  PolymorphicProps,
  PolymorphicPropsToOmit,
  PolymorphicRef,
} from "../utils/polimorphic";

export type CSSVars = Record<string, string>;

export type Mod = Record<string, unknown> | string;

// ─── BaseProps ──────────────────────────────────────────────────────────────
export type ComponentBaseProps = {
  vars?: CSSVars;
  unstyled?: boolean;
  slot?: string;
  mod?: Mod | Mod[];
  renderRoot?: (props: Record<string, unknown>) => React.ReactElement;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

// ─── SystemProps ──────────────────────────────────────────────────────────────
// Conjunto de props que el "sistema" de diseño entiende y procesa (estilos, tokens, variantes, etc.)
export type SystemProps = StyleProps & ComponentBaseProps;

// ─── Override HtmlAttributes over OwnProps ──────────────────────────────────────────────────────────
//  cuando hay colisión TypeScript intersecta ambas firmas y el resultado es never, OverrideNative — resuelve colisiones, tu OwnProps gana
type OverrideJsxComponentProps<E extends ElementType, OwnProps = object> = Omit<
  JSXProps<E>,
  keyof OwnProps
> &
  OwnProps;

// ─── HtmlProps ──────────────────────────────────────────────────────────
// Atributos HTML del componente Polimorfico, sin SystemProps, StyleProps, AsProp, ref, con OwnProps
export type ElementProps<E extends ElementType, OwnProps = object> = Omit<
  OverrideJsxComponentProps<E, OwnProps>,
  keyof SystemProps | PolymorphicPropsToOmit<E>
>;

export type ModProps = Record<`data-${string}`, string | boolean>;
export type SlotProps = { "data-slot": string } | Record<string, never>;

// ─── FactoryComponentProps ──────────────────────────────────────────────────────────
export type FactoryComponentProps<
  E extends ElementType,
  OwnProps = object,
> = PolymorphicProps<E, OwnProps & SystemProps>;

// ─── FactoryRenderProps ─────────────────────────────────────────────────────────────
export interface FactoryRenderProps<E extends ElementType, OwnProps = object> {
  ref: PolymorphicRef<E>; // ← agregado
  props: FactoryComponentProps<ElementType, OwnProps>;
  Component: E;
  elementProps: ElementProps<ElementType, OwnProps>;
  modProps: ModProps;
  slotProps: SlotProps;
  getStyle: (extraStyle?: CSSProperties) => CSSProperties | undefined;
}

// ─── Factory Function ─────────────────────────────────────────────────────────────
export type FactoryFn<DefaultTag extends ElementType, OwnProps> = <
  E extends ElementType = DefaultTag,
>(
  props: FactoryComponentProps<E, OwnProps>,
) => React.ReactElement | null;

type ComponentProperties = Omit<
  React.FunctionComponent<never>,
  keyof FactoryFn<any, any>
>;

// ─── Factory Component ─────────────────────────────────────────────────────────────
export type FactoryComponentPrimitive<
  DefaultTag extends ElementType,
  OwnProps = object,
  Statics extends Record<string, unknown> = Record<string, never>,
> = FactoryFn<DefaultTag, OwnProps> & ComponentProperties & Statics;

// factory.types.ts — nuevo tipo de retorno polimórfico
export type PolymorphicComponent<
  E extends ElementType,
  OwnProps = object,
  Statics extends Record<string, unknown> = Record<string, never>,
> = React.NamedExoticComponent<FactoryComponentProps<E, OwnProps>> & {
  displayName?: string;
} & Statics;

/* 
// Layout
export const Flex   = PolymorphicFactoryFn<"div">("div"); // display:flex preconfigurado
export const Grid   = PolymorphicFactoryFn<"div">("div"); // display:grid preconfigurado
export const Center = PolymorphicFactoryFn<"div">("div"); // flex + center preconfigurado
export const Stack  = PolymorphicFactoryFn<"div">("div"); // flex-col preconfigurado

// Contenido
export const Text   = PolymorphicFactoryFn<"p">("p");     // tipografía
export const Anchor = PolymorphicFactoryFn<"a">("a");     // links

// Superficie
export const Paper  = PolymorphicFactoryFn<"div">("div"); // contenedor con elevación


*/
