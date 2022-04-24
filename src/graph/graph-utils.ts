import type { GraphMetaData } from "./graph-meta-data";

export const createGraph = <TLength extends number, TOffset extends 0 | 1 = 0>(
  graphMap: GraphMetaData<TLength, TOffset>
): GraphMetaData<TLength, TOffset> => {
  return graphMap;
};

export const createNode = <TNode extends number>(nodeValue: number): TNode =>
  nodeValue as TNode;

// TODO: can we implicitly cast a type to primitive and vice versa?
export const nodeToNumber = <TNode extends number>(node: TNode): number =>
  node as number;
