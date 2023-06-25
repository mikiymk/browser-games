export type Tuple<T, N, List extends T[] = []> = List["length"] extends N ? List : Tuple<T, N, [T, ...List]>;
export type TupleIndex<T extends unknown[]> = {
  [k in keyof T]: k extends `${number}` ? k : never;
}[keyof T] extends infer R
  ? R extends `${infer N extends number}`
    ? N
    : never
  : never;

export type Awaitable<T> = T | Promise<T>;
