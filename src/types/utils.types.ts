export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Partialized<K extends keyof any, T> = Partial<Record<K, T>>;

export type Unpack<T> = T extends string
    ? T
    : T extends Record<string, object>
    ? string extends keyof T
    ? string
    : keyof T
    : undefined;
