type FlattenObject<
  T extends Record<string, unknown>,
  Prefix extends string = "",
  Sep extends string = ".",
> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? T[K] extends unknown[]
      ? Record<`${Prefix}${K & string}`, T[K]>
      : FlattenObject<T[K], `${Prefix}${K & string}${Sep}`>
    : Record<`${Prefix}${K & string}`, T[K]>;
}[keyof T];

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Flatten<T extends Record<string, unknown>> = UnionToIntersection<
  FlattenObject<T>
>;

export type Nullish = null | undefined;
export type OrPromise<T> = T | Promise<T>;
export type Maybe<T> = T | Nullish;
export type ObjectFromList<
  T extends readonly string[],
  V = string | string[] | undefined,
> = Record<T extends readonly (infer U)[] ? U : never, V>;
