import type { GraphMetaData } from "./graph-meta-data";

export const createGraph = <TLength extends number, TOffset extends number = 0>(
  graphMap: GraphMetaData<TLength, TOffset>
): GraphMetaData<TLength, TOffset> => {
  return graphMap;
};

export const createNode = <TNode>(nodeValue: number): TNode =>
  nodeValue as unknown as TNode;

// TODO: can we implicitly cast a type to primitive?
export const nodeToNumber = <TNode>(node: TNode): number =>
  node as unknown as number;
