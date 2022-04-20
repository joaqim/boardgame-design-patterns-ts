import type { FixedArray } from "./fixed-array";

export type AdjacencyMatrix<TSize extends number> = FixedArray<
  TSize,
  FixedArray<TSize, 0 | 1>
>;

export const AdjacencyMatrixIdentity = <TSize extends number>(
  size: number
): AdjacencyMatrix<TSize> =>
  Array.from({ length: size }).fill(
    Array.from({ length: size }).fill(0)
  ) as AdjacencyMatrix<TSize>;
