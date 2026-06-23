// ─── INTERNAL ────────────────────────────────────────────────────────────────

type _Words<
  S extends string,
  Current extends string = "",
> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? Head extends Lowercase<Head>
      ? _Words<Tail, `${Current}${Head}`>
      : Current extends ""
      ? _Words<Tail, Lowercase<Head>>
      : [Current, ..._Words<Tail, Lowercase<Head>>]
    : _Words<Tail, `${Current}${Head}`>
  : Current extends ""
  ? []
  : [Current];

type _Join<Words extends string[], Sep extends string> = Words extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? Rest extends []
    ? First
    : `${First}${Sep}${_Join<Rest, Sep>}`
  : "";

type _Capitalize<S extends string> = S extends `${infer Head}${infer Tail}`
  ? `${Uppercase<Head>}${Tail}`
  : S;

type _CapitalizeAll<Words extends string[]> = {
  [K in keyof Words]: Words[K] extends string
    ? _Capitalize<Words[K]>
    : Words[K];
};

type _UpperAll<Words extends string[]> = {
  [K in keyof Words]: Words[K] extends string ? Uppercase<Words[K]> : Words[K];
};

type _ParseKebab<S extends string> = S extends `${infer Head}-${infer Tail}`
  ? [Head, ..._ParseKebab<Tail>]
  : [S];

type _ParseSnake<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? [Head, ..._ParseSnake<Tail>]
  : [S];

type _ParseDot<S extends string> = S extends `${infer Head}.${infer Tail}`
  ? [Head, ..._ParseDot<Tail>]
  : [S];

type _ParsePath<S extends string> = S extends `${infer Head}/${infer Tail}`
  ? [Head, ..._ParsePath<Tail>]
  : [S];

type _ParseSpace<S extends string> = S extends `${infer Head} ${infer Tail}`
  ? [Head, ..._ParseSpace<Tail>]
  : [S];

// ─── CASE FORMAT ─────────────────────────────────────────────────────────────

export type CaseFormat =
  | "camel"
  | "pascal"
  | "kebab"
  | "snake"
  | "screaming-snake"
  | "train"
  | "dot"
  | "path"
  | "flat"
  | "upper-flat"
  | "title"
  | "sentence"
  | "lower"
  | "upper";

type _Tokenize<S extends string, From extends CaseFormat> = From extends "camel"
  ? _Words<S>
  : From extends "pascal"
  ? _Words<S>
  : From extends "kebab"
  ? _ParseKebab<Lowercase<S>>
  : From extends "snake"
  ? _ParseSnake<Lowercase<S>>
  : From extends "screaming-snake"
  ? _ParseSnake<Lowercase<S>>
  : From extends "train"
  ? _ParseKebab<Lowercase<S>>
  : From extends "dot"
  ? _ParseDot<Lowercase<S>>
  : From extends "path"
  ? _ParsePath<Lowercase<S>>
  : From extends "flat"
  ? [Lowercase<S>]
  : From extends "upper-flat"
  ? [Lowercase<S>]
  : From extends "title"
  ? _ParseSpace<Lowercase<S>>
  : From extends "sentence"
  ? _ParseSpace<Lowercase<S>>
  : From extends "lower"
  ? _ParseSpace<S>
  : From extends "upper"
  ? _ParseSpace<Lowercase<S>>
  : never;

type _Serialize<
  Words extends string[],
  To extends CaseFormat,
> = To extends "camel"
  ? Words extends [infer F extends string, ...infer R extends string[]]
    ? `${F}${_Join<_CapitalizeAll<R>, "">}`
    : ""
  : To extends "pascal"
  ? _Join<_CapitalizeAll<Words>, "">
  : To extends "kebab"
  ? _Join<Words, "-">
  : To extends "snake"
  ? _Join<Words, "_">
  : To extends "screaming-snake"
  ? _Join<_UpperAll<Words>, "_">
  : To extends "train"
  ? _Join<_CapitalizeAll<Words>, "-">
  : To extends "dot"
  ? _Join<Words, ".">
  : To extends "path"
  ? _Join<Words, "/">
  : To extends "flat"
  ? _Join<Words, "">
  : To extends "upper-flat"
  ? _Join<_UpperAll<Words>, "">
  : To extends "title"
  ? _Join<_CapitalizeAll<Words>, " ">
  : To extends "sentence"
  ? Words extends [infer F extends string, ...infer R extends string[]]
    ? `${_Capitalize<F>}${R extends []
        ? ""
        : ` ${_Join<R extends string[] ? R : [], " ">}`}`
    : ""
  : To extends "lower"
  ? _Join<Words, " ">
  : To extends "upper"
  ? _Join<_UpperAll<Words>, " ">
  : never;

// ─── PUBLIC: CONVERTER ───────────────────────────────────────────────────────

export type Convert<
  S extends string,
  From extends CaseFormat,
  To extends CaseFormat,
> = _Serialize<_Tokenize<S, From>, To>;

// ─── PUBLIC: STRING TRANSFORMERS (aliases de Convert desde camel) ─────────────

export type CamelCase<S extends string> = Convert<S, "camel", "camel">;
export type PascalCase<S extends string> = Convert<S, "camel", "pascal">;
export type KebabCase<S extends string> = Convert<S, "camel", "kebab">;
export type SnakeCase<S extends string> = Convert<S, "camel", "snake">;
export type ScreamingSnakeCase<S extends string> = Convert<
  S,
  "camel",
  "screaming-snake"
>;
export type TrainCase<S extends string> = Convert<S, "camel", "train">;
export type DotCase<S extends string> = Convert<S, "camel", "dot">;
export type PathCase<S extends string> = Convert<S, "camel", "path">;
export type FlatCase<S extends string> = Convert<S, "camel", "flat">;
export type UpperFlatCase<S extends string> = Convert<S, "camel", "upper-flat">;
export type TitleCase<S extends string> = Convert<S, "camel", "title">;
export type SentenceCase<S extends string> = Convert<S, "camel", "sentence">;
export type LowerCase<S extends string> = Convert<S, "camel", "lower">;
export type UpperCase<S extends string> = Convert<S, "camel", "upper">;

// ─── PUBLIC: OBJECT KEY TRANSFORMERS ─────────────────────────────────────────

export type CamelCaseKeys<TObj extends object> = {
  [K in keyof TObj as CamelCase<K & string>]: TObj[K];
};
export type PascalCaseKeys<TObj extends object> = {
  [K in keyof TObj as PascalCase<K & string>]: TObj[K];
};
export type KebabCaseKeys<TObj extends object> = {
  [K in keyof TObj as KebabCase<K & string>]: TObj[K];
};
export type SnakeCaseKeys<TObj extends object> = {
  [K in keyof TObj as SnakeCase<K & string>]: TObj[K];
};
export type ScreamingSnakeCaseKeys<TObj extends object> = {
  [K in keyof TObj as ScreamingSnakeCase<K & string>]: TObj[K];
};
export type TrainCaseKeys<TObj extends object> = {
  [K in keyof TObj as TrainCase<K & string>]: TObj[K];
};
export type DotCaseKeys<TObj extends object> = {
  [K in keyof TObj as DotCase<K & string>]: TObj[K];
};
export type PathCaseKeys<TObj extends object> = {
  [K in keyof TObj as PathCase<K & string>]: TObj[K];
};
export type FlatCaseKeys<TObj extends object> = {
  [K in keyof TObj as FlatCase<K & string>]: TObj[K];
};
export type UpperFlatCaseKeys<TObj extends object> = {
  [K in keyof TObj as UpperFlatCase<K & string>]: TObj[K];
};
export type TitleCaseKeys<TObj extends object> = {
  [K in keyof TObj as TitleCase<K & string>]: TObj[K];
};
export type SentenceCaseKeys<TObj extends object> = {
  [K in keyof TObj as SentenceCase<K & string>]: TObj[K];
};
export type LowerCaseKeys<TObj extends object> = {
  [K in keyof TObj as LowerCase<K & string>]: TObj[K];
};
export type UpperCaseKeys<TObj extends object> = {
  [K in keyof TObj as UpperCase<K & string>]: TObj[K];
};

// ─── PUBLIC: OBJECT KEY CONVERTER ────────────────────────────────────────────

export type ConvertKeys<
  TObj extends object,
  From extends CaseFormat,
  To extends CaseFormat,
> = { [K in keyof TObj as Convert<K & string, From, To>]: TObj[K] };

// Formatos                          | Ejemplos            |
// --------------------------------- | ------------------ |
// **camelCase**                     | `backgroundColor`  |
// **PascalCase**                    | `BackgroundColor`  |
// **kebab-case**                    | `background-color` |
// **snake_case**                    | `background_color` |
// **SCREAMING_SNAKE_CASE**          | `BACKGROUND_COLOR` |
// **Train-Case** (o **Cobol-Case**) | `Background-Color` |
// **dot.case**                      | `background.color` |
// **path/case**                     | `background/color` |
// **flatcase**                      | `backgroundcolor`  |
// **UPPERFLATCASE**                 | `BACKGROUNDCOLOR`  |
// **Title Case**                    | `Background Color` |
// **Sentence case**                 | `Background color` |
// **lower case**                    | `background color` |
// **UPPER CASE**                    | `BACKGROUND COLOR` |
