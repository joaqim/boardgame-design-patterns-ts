import type { FixedArray } from "../containers";
import type { NumberRange } from "../containers/number-range";

export type Node<
  TRange extends number,
  TStartIndex extends number = 0
> = NumberRange<TRange, TStartIndex>;

export type NodePath<TNode> = Array<TNode | null>;
export type NodeStack<TNode> = Array<NonNullable<TNode>>;
export type NodeDistances<TSize extends number> = FixedArray<
  TSize,
  number | null
>;

export type Edge<TNode> = [a: TNode, b: TNode];

export interface GraphMetaData<
  TSize extends number,
  TOffset extends number,
  TNode = Node<TSize, TOffset>,
  TEdge = Edge<TNode>
> {
  length: TSize;
  offset?: TOffset;
  nodes: TNode[];
  edges: TEdge[];
}
