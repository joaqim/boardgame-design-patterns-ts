import type * as graph from "../graph";
import type { Add } from "../math/meta-typing";
import type { FixedArray } from "./fixed-array";

export type AdjacencyMatrix<
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode extends number = graph.Node<TNodeSize, TOffset>
> = FixedArray<TNodeSize, FixedArray<TNodeSize, 0 | 1>> &
  Record<TNode, Record<TNode, 0 | 1>>;

const AdjacencyMatrixIdentity = <
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode extends number = graph.Node<TNodeSize, TOffset>
>(
  size: number,
  offset: 0 | 1 = 0
): AdjacencyMatrix<TLength, TOffset, TNodeSize, TNode> =>
  Array.from({ length: size + offset }, (_value: unknown, column: number) =>
    column < offset
      ? Array.from({ length: size + offset }).fill(null)
      : Array.from({ length: size + offset }, (__value: unknown, row: number) =>
          row < offset ? null : 0
        )
  ) as AdjacencyMatrix<TLength, TOffset, TNodeSize, TNode>;

export interface AdjacencyMatrixMetaData<
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode extends number = graph.Node<TNodeSize, TOffset>,
  TEdge = graph.Edge<TNode>
> {
  length: number;
  offset?: 0 | 1;
  edges?: TEdge[];
  directedEdges?: TEdge[];
}

export const createAdjacencyMatrix = <
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode extends number = graph.Node<TNodeSize, TOffset>
>(
  data: AdjacencyMatrixMetaData<TLength, TOffset, TNodeSize, TNode>
): AdjacencyMatrix<TLength, TOffset, TNodeSize, TNode> => {
  const matrix = AdjacencyMatrixIdentity<TLength, TOffset, TNodeSize, TNode>(
    data.length,
    data.offset
  );

  data.edges?.forEach((edge) => {
    const start = edge[0];
    const end = edge[1];
    // matrix[start][end] = 1;
    // matrix[end][start] = 1;

    (matrix as number[][])[start][end] = 1;
    (matrix as number[][])[end][start] = 1;
  });
  data.directedEdges?.forEach((edge) => {
    // matrix[edge[0]][edge[1]] = 1;
    (matrix as number[][])[edge[0]][edge[1]] = 1;
  });

  return matrix;
};
