import type * as graph from "../graph";
import type { FixedArray } from "./fixed-array";

export type AdjacencyMatrix<
  TNodeSize extends number,
  TNode extends number = graph.Node<TNodeSize>
> = FixedArray<TNodeSize, FixedArray<TNodeSize, 0 | 1>> &
  Record<TNode, Record<TNode, 0 | 1>>;

const AdjacencyMatrixIdentity = <
  TNodeSize extends number,
  TNode extends number = graph.Node<TNodeSize>
>(
  size: number
): AdjacencyMatrix<TNodeSize, TNode> =>
  Array.from({ length: size }, () =>
      Array.from({ length: size }).fill(0)
  ) as AdjacencyMatrix<TNodeSize, TNode>;

export interface AdjacencyMatrixMetaData<
  TNodeSize extends number,
  TNode extends number = graph.Node<TNodeSize>,
  TEdge = graph.Edge<TNode>
> {
  length: number;
  edges?: TEdge[];
  directedEdges?: TEdge[];
}

export const createAdjacencyMatrix = <
  TNodeSize extends number,
  TNode extends number = graph.Node<TNodeSize>
>(
  data: AdjacencyMatrixMetaData<TNodeSize, TNode>
): AdjacencyMatrix<TNodeSize, TNode> => {
  const matrix = AdjacencyMatrixIdentity<TNodeSize, TNode>(
    data.length,
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
