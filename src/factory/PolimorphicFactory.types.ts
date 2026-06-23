import type { CSSProperties } from "react";
import type {
  PolymorphicComponentProps,
  PolymorphicRef,
} from "../types/polimorphic.types";
import type {
  FactoryConfig,
  FactoryOptions,
  MyComponentProps,
} from "./factories.types";
import type { ResolvedStylesResult } from "../system/resolve-styles";

// ─── Polymorphic Render Props ─────────────────────────────────────────────────────────────
export interface PolymorphicRenderProps<Config extends FactoryConfig> {
  ref: PolymorphicRef<Config["defaultTag"]>;
  props: PolymorphicComponentProps<Config["defaultTag"], Config["ownProps"]>;
  Component: Config["defaultTag"];
  componentProps: MyComponentProps<Config["defaultTag"], Config["ownProps"]>;
  getStyle: (extraStyle?: CSSProperties) => ResolvedStylesResult;
}

// ─── Polymorphic Options ─────────────────────────────────────────────────────────────
export type PolymorphicFactoryOptions<Config extends FactoryConfig> =
  FactoryOptions<Config, PolymorphicRenderProps<Config>>;
