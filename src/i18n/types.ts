export type TranslationShape<T> = {
  [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends readonly string[]
      ? readonly string[]
      : TranslationShape<T[Key]>;
};
