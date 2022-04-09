import type { GraphMetaData } from "./graph-meta-data";

/*
export const createNode = <TSize extends number>(
  nodeValue: number
): Node<TSize> => <Node<TSize>>nodeValue;
*/
export const createGraph = <
  // TNodeSize extends number,
  // TOffset extends number = 0

  TLength extends number,
  TOffset extends number = 0
  // TNodeSize extends number = Add<TLength, TOffset>
>(
  graphMap: GraphMetaData<TLength, TOffset>
): GraphMetaData<TLength, TOffset> => {
  return graphMap;
};

export const createNode = <TNode>(nodeValue: number): TNode =>
  nodeValue as unknown as TNode;

// TODO: can we implicitly cast a type to primitive?
export const nodeToNumber = <TNode>(node: TNode): number =>
  node as unknown as number;
