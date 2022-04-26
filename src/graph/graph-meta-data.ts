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
export type EdgeArray<TNode> = Array<[a: TNode, b: TNode]>;

export interface Region<TNodeSize extends number, TNode = Node<TNodeSize>> {
  nodes?: Array<TNode | null>;
  edges?: EdgeArray<TNode>;
  directedEdges?: EdgeArray<TNode>;
  stepLimit?: number;
}

export interface RegionMetaData<
  TNodeSize extends number,
  TNode = Node<TNodeSize>,
> {
  edges?: EdgeArray<TNode>;
  directedEdges?: EdgeArray<TNode>;
  extends?: string[];
  stepLimit?: number;
}

export interface GraphMetaData<
  TNodeSize extends number,
  TNode = Node<TNodeSize>,
> {
  length: TNodeSize;
  edges?: EdgeArray<TNode>;
  directedEdges?: EdgeArray<TNode>;
  regions?: Record<string, RegionMetaData<TNodeSize, TNode>> & {
    default?: RegionMetaData<TNodeSize, TNode>;
  };
  conditional?: Record<string, RegionMetaData<TNodeSize, TNode>>;
}