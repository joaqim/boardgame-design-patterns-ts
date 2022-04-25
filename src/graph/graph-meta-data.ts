import type { FixedArray } from "../containers";
import type { NumberRange } from "../containers/number-range";
import type { Add } from "../math/meta-typing";

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

interface Region<
  TNodeSize extends number,
  TNode = Node<TNodeSize>,
  TEdge = Edge<TNode>
> {
  nodes?: Array<TNode | null>;
  edges?: TEdge[];
  directedEdges?: TEdge[];
  extends?: string[];
  stepLimit?: number;
}

export interface GraphMetaData<
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode = Node<TNodeSize, TOffset>,
  TEdge = Edge<TNode>
> {
  length: TLength;
  offset?: TOffset;
  // nodes: TNode[];
  // nodes?: FixedArray<TNodeSize, TNode | null>;
  edges?: TEdge[];
  directedEdges?: TEdge[];
  regions?: Record<string, Region<TNodeSize, TNode, TEdge>>;
  conditional?: Record<string, Region<TNodeSize, TNode, TEdge>>;
}
