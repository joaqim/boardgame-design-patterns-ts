type Grow<T, A extends T[]> = ((x: T, ...xs: A) => void) extends (
  ...a: infer X
) => void
  ? X
  : never;

type GrowToSize<T, A extends T[], N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A["length"] extends N ? 0 : 1];

export type FixedArray<N extends number, T = number> = GrowToSize<T, [], N>;

export const toFixedArray = <TSize extends number, T = number | null>(
  array: T[]
): FixedArray<TSize, T> => <FixedArray<TSize, T>>[...array];
