import type { Node, GraphMetaData } from "./graph-meta-data";

export const createNode = <TSize extends number>(
  nodeValue: number
): Node<TSize> => <Node<TSize>>nodeValue;

export const createGraph = <TSize extends number>(
  graphMap: GraphMetaData<TSize>
): GraphMetaData<TSize> => graphMap;

export const nodeToNumber = <TNode>(node: TNode): number =>
  node as unknown as number;
