import type * as graph from "../graph";
import type { FixedArray } from "./fixed-array";

export type AdjacencyMatrix<TSize extends number> = FixedArray<
  TSize,
  FixedArray<TSize, 0 | 1>
>;

const AdjacencyMatrixIdentity = <TLength extends number>(
  size: number
): AdjacencyMatrix<TLength> =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }).fill(0)
  ) as AdjacencyMatrix<TLength>;

export interface AdjacencyMatrixMetaData<
  TLength extends number,
  TNode extends number = graph.Node<TLength>,
  TEdge extends number[] = graph.Edge<TNode>
> {
  length: TLength;
  edges?: TEdge[];
}

export const createAdjacencyMatrix = <
  TLength extends number,
  TNode extends number = graph.Node<TLength>
>(
  data: AdjacencyMatrixMetaData<TLength, TNode>
): AdjacencyMatrix<TLength> => {
  const matrix = AdjacencyMatrixIdentity<TLength>(data.length);

  data.edges?.forEach((edge) => {
    const start = edge[0];
    const end = edge[1];
    (matrix as number[][])[start][end] = 1;
    (matrix as number[][])[end][start] = 1;
  });

  return matrix;
};
