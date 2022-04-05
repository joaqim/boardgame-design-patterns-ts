export type GraphEdge = [a: number, b: number];
export type GraphNode = number;

export default interface GraphMap {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
