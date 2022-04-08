import type { GraphMetaData } from "./graph-meta-data";

/*
export const createNode = <TSize extends number>(
  nodeValue: number
): Node<TSize> => <Node<TSize>>nodeValue;
*/
export const createNode = <TNode>(nodeValue: number): TNode =>
  nodeValue as unknown as TNode;

export const createGraph = <TSize extends number, TOffset extends number = 0>(
  graphMap: GraphMetaData<TSize, TOffset>
): GraphMetaData<TSize, TOffset> => graphMap;

export const nodeToNumber = <TNode>(node: TNode): number =>
  node as unknown as number;
