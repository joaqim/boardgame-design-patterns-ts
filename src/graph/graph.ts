import { assert } from "chai";
import { toFixedArray } from "../containers";
import type {
  Edge,
  GraphMetaData,
  Node,
  NodeDistances,
  NodePath,
  NodeStack,
} from "./graph-meta-data";
import { createNode, nodeToNumber } from "./graph-utils";

/** Graph */
export default class Graph<
  TNodeSize extends number,
  TNode = Node<TNodeSize>,
  TOffset extends number = 0
> {
  private readonly list = new Map<TNode, TNode[]>();
  private readonly matrix: number[][] = [];
  public readonly nodeCount: number;
  public readonly offset;

  public constructor(map: GraphMetaData<TNodeSize, TOffset, TNode>) {
    this.offset = map.offset ?? 0;
    this.nodeCount = map.length;

    map.nodes.forEach((node) => this.addNode(node));
    map.edges.forEach((edge) => this.addEdge(edge));
  }

  /**
   * Adds node to graph.
   * @param {TNode} node
   * @returns {void}
   */
  private addNode(node: TNode): void {
    this.list.set(node, []);

    for (const col of this.matrix) {
      col.push(0);
    }

    this.matrix.push(
      Array.from<number>({ length: this.matrix.length }).fill(0)
    );
  }

  /**
   * Adds edge between two existing nodes
   * @param {[TNode, TNode]} edge
   * @returns {void}
   */
  private addEdge(edge: Edge<TNode>): void {
    // TODO: can we implicitly cast a type to primitive?
    // TNode being interchangable with [index:number] of any array
    // nodeToNumber(node):number => node as unknown as number
    let start = nodeToNumber(edge[0]);
    let end = nodeToNumber(edge[1]);

    assert(start <= this.nodeCount);
    assert(end <= this.nodeCount);

    this.list.get(edge[0])?.push(edge[1]);
    this.list.get(edge[1])?.push(edge[0]);

    start -= this.offset;
    end -= this.offset;

    this.matrix[start][end] = 1;
    this.matrix[end][start] = 1;
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
    const stack: NodeStack<TNode> = [start];
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

  public generateDistancesAndPath(start: TNode = createNode<TNode>(0)): {
    distances: NodeDistances<TNodeSize>;
    path: NodePath<TNode>;
  } {
    // This contains the distances from the start node to all other nodes
    // Initializing with a distance of "Infinity"
    const distances = Array.from<number>({
      length: this.matrix.length + this.offset,
    }).fill(Number.MAX_VALUE);

    const startIndex = Math.max(nodeToNumber(start), this.offset);
    // The distance from the start node to itself is 0
    distances[startIndex] = 0;

    // This contains whether a node was already visited
    const visited = [];
    // const visited = Array.from<boolean>({ length: this.offset }).fill(true);

    // path tree
    const path = Array.from<number | null>({ length: this.matrix.length });

    // The starting node does not
    // have a parent in path tree
    path[startIndex] = null;

    // While there are nodes left to visit...
    for (;;) {
      // ... find the node with the currently shortest distance from the start node...
      let shortestDistance = Number.MAX_VALUE;
      let shortestIndex = -1;

      for (let index = 0; index < this.matrix.length; index += 1) {
        // ... by going through all nodes that haven't been visited yet
        if (
          distances[index + this.offset] < shortestDistance &&
          !visited[index]
        ) {
          shortestDistance = distances[index + this.offset];
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
          distances[index + this.offset] >
            distances[shortestIndex + this.offset] +
              this.matrix[shortestIndex][index]
        ) {
          // ...Save this path as new shortest path.
          path[index] = shortestIndex;
          distances[index + this.offset] =
            distances[shortestIndex + this.offset] +
            this.matrix[shortestIndex][index];
        }
      }
      // Lastly, note that we are finished with this node.
      visited[shortestIndex] = true;
    }

    return {
      distances: toFixedArray<TNodeSize>(distances),
      path: <NodePath<TNode>>[...path],
    };
  }

  /**
   *  Recursively walk through linked list of Nodes
   *  representing the path to walk to target, where
   *  the last node is guaranteed to be the expected
   *  target.
   *
   * @param {number} nextTarget
   * @param {Node[]} path
   * @returns {void}
   */

  public walkPathToEnd(
    path: Array<TNode | null>,
    nextTarget: TNode | null = createNode(this.offset),
    retries = 0
  ): void {
    if (
      (nextTarget === undefined &&
        path[nodeToNumber(nextTarget)] === undefined) ||
      retries > 128
    ) {
      throw new Error("Cannot travel to node");
    }

    if (nextTarget === null) {
      return;
    }

    retries += 1;
    this.walkPathToEnd(path, path[nodeToNumber(nextTarget)], retries);
  }
}
