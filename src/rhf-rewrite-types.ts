import type {
  BrowserNativeObject,
  FieldValues,
  IsEqual,
  Primitive,
} from "react-hook-form";

export type TupleKeys<T extends readonly any[]> = Exclude<keyof T, keyof any[]>;
export type IsTuple<T extends readonly any[]> = number extends T["length"]
  ? false
  : true;
export type ArrayKey = number | "[]";
type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;
type PathImpl<K extends string | number, V, TraversedTypes> = V extends
  | Primitive
  | BrowserNativeObject
  ? `${K}`
  : true extends AnyIsEqual<TraversedTypes, V>
  ? `${K}`
  : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
type PathInternal<T, TraversedTypes = T> = T extends readonly (infer V)[]
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V, TraversedTypes>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
    }[keyof T];

export type Path<T> = T extends any ? PathInternal<T> : never;
export type FieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>;
