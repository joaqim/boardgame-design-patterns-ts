import type { NumberRange } from "@containers/number-range";

export type Node<TRange extends number> = number & NumberRange<TRange>;

export type Edge<TNode> = [TNode, TNode];

export default interface GraphMap<
  TSize extends number,
  TNode = Node<TSize>,
  TEdge = [a: TNode, b: TNode]
> {
  length: TSize;
  nodes: TNode[];
  edges: TEdge[];
}

export const createGraph = <TSize extends number>(
  graphMap: GraphMap<TSize>
): GraphMap<TSize> => graphMap;

export const createNode = <TSize extends number>(
  nodeValue: number
): Node<TSize> => <Node<TSize>>nodeValue;
