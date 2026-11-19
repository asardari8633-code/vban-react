type Recordable<T = any> = Record<string, T>;

type Nullable<T> = null | T;

type MaybePromise<T> = Promise<T> | T;

type AnyFunction = (...args: any[]) => any;

type DeepPartial<T> = T extends object
  ? T extends readonly any[]
    ? T
    : { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
    : T;

type ValueOf<T> = T[keyof T];

export type {
  AnyFunction,
  DeepPartial,
  DeepReadonly,
  MaybePromise,
  Nullable,
  Recordable,
  ValueOf,
};
