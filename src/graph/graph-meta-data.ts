import type { NumberRange } from "../containers/number-range";

export type Node<TRange extends number> = NumberRange<TRange>;

export type Edge<TNode> = [TNode, TNode];

export interface GraphMetaData<
  TSize extends number,
  TNode = Node<TSize>,
  TEdge = [a: TNode, b: TNode]
> {
  length: TSize;
  nodes: TNode[];
  edges: TEdge[];
}
