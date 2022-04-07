import { assert } from "chai";
import type GraphMapdata from "./graph-map";
import type { Node } from "./graph-map";
import { nodeToNumber } from "./graph-map";

export default class Graph<TNodeSize extends number, TNode = Node<TNodeSize>> {
  private readonly list = new Map<TNode, TNode[]>();
  private readonly matrix: number[][] = [];
  public readonly nodeCount: number;

  public constructor(map: GraphMapdata<TNodeSize, TNode>) {
    this.nodeCount = map.length;
    map.nodes.forEach((node) => this.addNode(node));
    map.edges.forEach((edge) => this.addEdge(edge));
  }

  public addNode(node: TNode): void {
    assert(nodeToNumber(node) <= this.nodeCount);

    this.list.set(node, []);

    for (const col of this.matrix) {
      col.push(0);
    }

    this.matrix.push(
      Array.from<number>({ length: this.matrix.length }).fill(0)
    );
  }

  public addEdge(edge: [a: TNode, b: TNode]): void {
    // TODO: Is there any way to make this nicer?
    // But we need to be able to  implicitly cast
    // a type to primitive, is that possible?
    // nodeToNumber(node):number => node as unknown as number
    const start = nodeToNumber(edge[0]);
    const end = nodeToNumber(edge[1]);

    assert(start <= this.nodeCount);
    assert(end <= this.nodeCount);

    this.list.get(edge[0])?.push(edge[1]);
    this.list.get(edge[1])?.push(edge[0]);

    this.matrix[start][end] = 1;
    this.matrix[end][start] = 1;
  }

  public addEdgeBetweenNodes(nodeA: TNode, nodeB: TNode): void {
    this.addEdge([nodeA, nodeB]);
  }

  /**
   * Returs the path to target as a simple linked list
   * The path is a one dimensional array where the
   * index is the index/id of the node and the number
   * stored is the index/id * of its parent.
   *
   * To use, recursively follow nodes parents until
   * finding null, which is the target of search
   *
   * @param {NonNullable<TNode>} start
   * @param {NonNullable<TNode>} target
   * @returns {Array<TNode | null>}
   */
  public dfsPath(
    start: NonNullable<TNode>,
    target: NonNullable<TNode>
  ): Array<TNode | undefined> {
    // Stack will never contain null
    const stack: Array<NonNullable<TNode>> = [start];
    const visited = new Set();
    visited.add(start);
    const path: Array<TNode | undefined> = [];

    while (stack.length > 0) {
      const current = <TNode>stack.pop();

      if (current !== start) path.push(current);
      const children = this.list.get(current);

      if (children !== undefined) {
        for (const neigh of children) {
          if (!visited.has(neigh)) {
            visited.add(neigh);
            stack.push(<NonNullable<TNode>>neigh);

            // Found target!
            if (neigh === target) {
              path.push(neigh);
              return path;
            }
          }
        }
      }
    }
    return [undefined];
  }

  public dijkstra(start: number): {
    distances: Array<number | null>;
    path: Array<number | null>;
  } {
    // This contains the distances from the start node to all other nodes
    // Initializing with a distance of "Infinity"
    const distances: number[] = Array.from<number>({
      length: this.matrix.length,
    }).fill(Number.MAX_VALUE);

    // The distance from the start node to itself is of course 0
    distances[start] = 0;

    // This contains whether a node was already visited
    const visited = [];

    // path tree
    const path = Array.from<number | null>({ length: this.matrix.length });

    // The starting node does not
    // have a parent in path tree
    path[start] = null;

    // While there are nodes left to visit...
    for (;;) {
      // ... find the node with the currently shortest distance from the start node...
      let shortestDistance = Number.MAX_VALUE;
      let shortestIndex = -1;

      for (let index = 0; index < this.matrix.length; index += 1) {
        // ... by going through all nodes that haven't been visited yet
        if (distances[index] < shortestDistance && !visited[index]) {
          shortestDistance = distances[index];
          shortestIndex = index;
        }
      }

      if (shortestIndex === -1) {
        // There was no node not yet visited --> We are done
        break;
        // return distances;
      }

      // ...then, for all neighboring nodes....
      for (
        let index = 0;
        index < this.matrix[shortestIndex].length;
        index += 1
      ) {
        // ...if the path over this edge is shorter...
        if (
          this.matrix[shortestIndex][index] !== 0 &&
          distances[index] >
            distances[shortestIndex] + this.matrix[shortestIndex][index]
        ) {
          // ...Save this path as new shortest path.
          path[index] = shortestIndex;
          distances[index] =
            distances[shortestIndex] + this.matrix[shortestIndex][index];
        }
      }
      // Lastly, note that we are finished with this node.
      visited[shortestIndex] = true;
    }
    return { distances, path };
  }

  /*
  public dfs(start: GraphTile, target: GraphTile): GraphTile | null {
    if (start.id === target.id) {
      return start;
    }

    // Recurse with all children
    for (const child of start.children) {
      const result = this.dfs(child, target);

      if (result !== null) {
        // We've found the goal node while going down that child
        return result;
      }
    }

    // We've gone through all children and not found the goal node
    return null;
  }
  */
}
