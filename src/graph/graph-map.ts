import type { NumberRange } from "@containers/number-range";

export type Node<TRange extends number> = NumberRange<TRange>;

export type Edge<TNode> = [TNode, TNode];

export default interface GraphMapData<
  TSize extends number,
  TNode = Node<TSize>,
  TEdge = [a: TNode, b: TNode]
> {
  length: TSize;
  nodes: TNode[];
  edges: TEdge[];
}

export const createNode = <TSize extends number>(
  nodeValue: number
): Node<TSize> => <Node<TSize>>nodeValue;

export const createGraph = <TSize extends number>(
  graphMap: GraphMapData<TSize>
): GraphMapData<TSize> => graphMap;

export const nodeToNumber = <TNode>(node: TNode): number =>
  node as unknown as number;
