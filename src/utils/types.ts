export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Fuerza a TypeScript a resolver la intersección en un objeto concreto
// Sin esto permanece como intersección lazy y causa problemas
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type MergeBaseCustoms<Base, Custom> = Prettify<
  Base & {
    [K in keyof Custom]: Custom[K];
  }
>;

export type MergeBaseCustomsOverride<Base, Custom> = Prettify<
  Partial<Base> & Partial<{ [K in keyof Custom]: Custom[K] }>
>;

export type MergeColorsOverride<Base, Custom> = Prettify<
  { [K in keyof Base]?: DeepPartial<Base[K]> } & {
    [K in keyof Custom]?: Custom[K];
  }
>;
