import type { AdjacencyMatrix, FixedArray } from "../containers";
import { createAdjacencyMatrix, toFixedArray } from "../containers";
import type { Add } from "../math/meta-typing";
import type {
  Edge,
  GraphMetaData,
  Node,
  NodeDistances,
  NodePath,
  NodeStack
} from "./graph-meta-data";
import { createNode } from "./graph-utils";

/** Node Graph */
export default class Graph<
  TLength extends number,
  TOffset extends 0 | 1 = 0,
  TNodeSize extends number = Add<TLength, TOffset>,
  TNode extends number = Node<TNodeSize, TOffset>
> {
  private readonly list = new Map<TNode, TNode[]>();
  // private readonly matrix: number[][] = [];
  private readonly matrix: AdjacencyMatrix<TLength, TOffset, TNodeSize, TNode>;
  // private readonly data: GraphMetaData<TLength, TOffset, TNodeSize, TNode>;
  private readonly nodes: FixedArray<TNodeSize, TNode | null>;
  public readonly length: number;
  public readonly offset;

  public distances?: NodeDistances<TNodeSize>;

  public path?: NodePath<TNode>;

  public constructor(data: GraphMetaData<TLength, TOffset, TNodeSize, TNode>) {
    this.offset = data.offset ?? 0;

    if (data.length <= 0) {
      throw new Error("Graph: Cannot create graph with length of 0 or less.");
    }
    this.length = data.length;

    this.nodes = <FixedArray<TNodeSize, TNode | null>>(
      Array.from({ length: data.length + this.offset })
    );

    (this.nodes as TNode[]).forEach((node, index) => {
      (this.nodes as number[])[index + this.offset] = index + this.offset;
      this.list.set(node, []);
    });

    this.matrix = createAdjacencyMatrix<TLength, TOffset, TNodeSize, TNode>({
      length: data.length,
      offset: data.offset,
      edges: data.edges,
      directedEdges: data.directedEdges
    });

    data.edges?.forEach((edge) => this.addEdge(edge));
    data.directedEdges?.forEach((edge) => this.addEdge(edge, false));
  }

  /**
   * Adds edge between two existing nodes
   * @param {[TNode, TNode]} edge
   * @param {boolean} [bidirectional=true]
   * @returns {void}
   */
  private addEdge(edge: Edge<TNode>, bidirectional = true): void {
    this.list.get(edge[0])?.push(edge[1]);

    if (bidirectional) {
      this.list.get(edge[1])?.push(edge[0]);
    }
  }

  /** TODO:
   * Greedy best-first search
   *
   * Does not take into account the distance from start
   * to target.
   *
   * https://en.wikipedia.org/wiki/Best-first_search#Greedy_BFS
   *
   * @param {NonNullable<TNode>} target
   * @returns {NodePath<TNode>} path from start to target
   */
  // eslint-disable-next-line class-methods-use-this
  public bfsPath(target: NonNullable<TNode>): Array<TNode | undefined> {
    return [undefined, target];
  }

  /** Depth-first search
   *
   * @param {NonNullable<TNode>} start
   * @param {NonNullable<TNode>} target
   * @returns {NodePath<TNode>} path from start to target
   */
  public dfsPath(
    start: NonNullable<TNode>,
    target: NonNullable<TNode>
  ): Array<TNode | undefined> {
    // Stack will never contain null
    const stack: NodeStack<TNode> = [start];
    const visited = new Set<TNode>();
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

  /**
   *
   * @param {TNode} [start=createNode<TNode>(0)]
   * @return {*}  {{
   *     distances: NodeDistances<TNodeSize>;
   *     path: NodePath<TNode>;
   *   }}
   * @memberof Graph
   */
  public generateDistancesAndPath(start: TNode = createNode<TNode>(0)): {
    distances: NodeDistances<TNodeSize>;
    path: NodePath<TNode>;
  } {
    // This contains the distances from the start node to all other nodes
    // Initializing with a distance of "Infinity"
    const distances = Array.from<number>({
      length: this.length + this.offset
    }).fill(Number.MAX_VALUE);

    // Starting index cannot be lower than offset
    const startIndex = Math.max(start, this.offset);

    // The distance from the start node to itself is 0
    distances[startIndex] = 0;

    // This contains whether a node was already visited
    const visited = [];
    // const visited = Array.from<boolean>({ length: this.offset }).fill(true);

    // path tree
    const path = Array.from<number | null>({ length: this.length });

    // The starting node does not
    // have a parent in path tree
    path[startIndex] = null;

    // While there are nodes left to visit...
    for (;;) {
      // ... find the node with the currently shortest distance from the start node...
      let shortestDistance = Number.MAX_VALUE;
      let shortestIndex = -1;

      for (
        let index = this.offset;
        index < this.length + this.offset;
        index += 1
      ) {
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
        let index = this.offset;
        index < this.length + this.offset;
        index += 1
      ) {
        // ...if the path over this edge is shorter...
        if (
          (this.matrix as number[][])[shortestIndex][index] !== 0 &&
          distances[index] >
            distances[shortestIndex] +
              (this.matrix as number[][])[shortestIndex][index]
        ) {
          // ...Save this path as new shortest path.
          path[index] = shortestIndex;
          distances[index] =
            distances[shortestIndex] +
            (this.matrix as number[][])[shortestIndex][index];
        }
      }
      // Lastly, note that we are finished with this node.
      visited[shortestIndex] = true;
    }

    this.distances = toFixedArray<TNodeSize>(distances);
    this.path = <NodePath<TNode>>[...path];

    return {
      distances: this.distances,
      path: this.path
    };
  }

  // eslint-disable-next-line class-methods-use-this
  public walkPath(
    start: TNode | null,
    path: NodePath<TNode>,
    callback?: (node: TNode | null) => void
  ): void {
    if (start === null) return;
    const nextNode = path[start];
    callback?.(nextNode);
    this.walkPath(nextNode, path, callback);
  }

  public nodesWithinReach(
    reach: TNode
    // distances: Array<TNode | null>
  ): TNode[] {
    const result: TNode[] = [];

    if (this.distances === undefined || this.path === undefined) {
      return result;
    }

    for (
      let index = this.offset + 1;
      index < this.length + this.offset;
      index += 1
    ) {
      const dist = (this.distances as number[])[index];

      if (dist <= reach) {
        const node = this.path[index];

        if (node !== null) result.push(createNode(index));
      }
    }

    return result;
  }

  /**
   *  Walk through linked list of Nodes
   *  representing the path to walk to target, where
   *  the last node is guaranteed to be the expected
   *  target.
   *
   * @param {Node[]} path
   * @param {function(node: TNode | null):void} [callback]
   * @returns {void}
   */

  // eslint-disable-next-line class-methods-use-this
  public walkPathToEnd(
    path: Array<TNode | null>,
    callback?: (node: TNode | null) => void
  ): void {
    for (const node of path) {
      if (node === undefined) {
        return;
      }

      callback?.(node);
    }
  }

  /**
   *  Walk through linked list of Nodes
   *  representing the path to walk to target, where
   *  the last node is guaranteed to be the expected
   *  target.
   *
   * @param {Node[]} path
   * @param {number} target
   * @param {function(node: TNode | null):void} [callback]
   * @returns {void}
   */

  // eslint-disable-next-line class-methods-use-this
  public walkPathToTarget(
    path: Array<TNode | null>,
    target: TNode | null,
    callback?: (node: TNode | null) => void
  ): void {
    // Target is at origin
    if (target === null) {
      return;
    }

    // Target is unreachable from precalculated paths
    if (path[target] === undefined) {
      throw new Error("Cannot reach node");
    }

    for (const node of path) {
      callback?.(node);

      // Found target
      if (node === target) {
        return;
      }
    }

    // Did not find target
  }

  public forEachNode(callback: (nodes: TNode[], key: TNode) => void): void {
    this.list.forEach((nodes, key) => callback(nodes, key));
  }
}
