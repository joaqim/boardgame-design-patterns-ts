import type { GraphMetaData } from "./graph-meta-data";

export const createGraphData = <TLength extends number>(
  graphMap: GraphMetaData<TLength>
): GraphMetaData<TLength> => {
  return graphMap;
};

export const createNode = <TNode extends number>(nodeValue: number): TNode =>
  nodeValue as TNode;

// TODO: can we implicitly cast a type to primitive and vice versa?
export const nodeToNumber = <TNode extends number>(node: TNode): number =>
  node as number;
