import type { AdjacencyMatrix, FixedArray } from "../containers";
import { createAdjacencyMatrix, toFixedArray } from "../containers";
import type {
  Edge,
  EdgeArray,
  GraphMetaData,
  Node,
  NodeDistances,
  NodePath,
  NodeStack,
  Region,
  RegionMetaData
} from "./graph-meta-data";
import { createNode } from "./graph-utils";

/** Node Graph */
export default class Graph<
  TNodeSize extends number,
  TNode extends number = Node<TNodeSize>
> {
  private readonly list = new Map<TNode, TNode[]>();
  // private readonly matrix: number[][] = [];
  private matrix?: AdjacencyMatrix<TNodeSize, TNode>;
  private readonly data: GraphMetaData<TNodeSize, TNode>;
  private readonly nodes: FixedArray<TNodeSize, TNode | null>;
  public readonly length: number;


  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private regions = new Map<string, Region<TNodeSize, TNode>>();

  public distances?: NodeDistances<TNodeSize>;

  public path?: NodePath<TNode>;

  public constructor(data: GraphMetaData<TNodeSize, TNode>) {
    if (data.length <= 0) {
      throw new Error("Graph: Cannot create graph with length of 0 or less.");
    }
    this.data = data;
    this.length = data.length;

    this.nodes = <FixedArray<TNodeSize, TNode | null>>Array.from(
      { length: data.length },
      (_value: undefined, index: number) => {
        this.list.set(createNode(index), []);
        return index;
      }
    );

    if (data.edges || data.directedEdges) {
      this.regions.set("default", {
        edges: data.edges,
        directedEdges: data.directedEdges
      });
    } else if (data.regions?.default) {
      this.regions.set("default", this.initializeRegion(data.regions.default));
    } else {
      throw new Error("Missing default Region");
    }

    if (data.regions) {
      Object.entries(data.regions).forEach(([name, region]): void => {
        this.regions.set(name, this.initializeRegion(region));
      });
    }

    this.setRegion("default");
  }

  // eslint-disable-next-line class-methods-use-this
  private concatEdges(
    edgesLhs: EdgeArray<TNode> | undefined,
    edgesRhs: EdgeArray<TNode> | undefined
  ): EdgeArray<TNode> | undefined {
    let result: EdgeArray<TNode> | undefined;

    if (!edgesLhs) {
      result = edgesRhs;
    } else if (edgesRhs) {
      result = [...edgesLhs, ...edgesRhs];
    }
    return result;
  }

  private concatRegions(
    regionLhs: Region<TNodeSize, TNode>,
    regionRhs: Region<TNodeSize, TNode>
  ): Region<TNodeSize, TNode> {
    return {
      edges: this.concatEdges(regionLhs.edges, regionRhs.edges),
      directedEdges: this.concatEdges(
        regionLhs.directedEdges,
        regionRhs.directedEdges
      )
    };
  }

  private initializeRegion(
    region: RegionMetaData<TNodeSize, TNode>
  ): Region<TNodeSize, TNode> {
    let result: Region<TNodeSize, TNode> = {
      edges: region.edges,
      directedEdges: region.directedEdges,
      stepLimit: region.stepLimit
    };
    region.extends?.forEach((extendKey: string) => {
      const extendRegion = this.data.regions?.[extendKey];

      if (extendRegion) {
        result = this.concatRegions(
          result,
          this.initializeRegion(extendRegion)
        );
      }
    });
    return result;
  }

  private setRegion(name: string): void {
    const region = this.regions.get(name);
    this.recalculate(region?.edges, region?.directedEdges);
  }

  private recalculate(
    edges?: EdgeArray<TNode>,
    directedEdges?: EdgeArray<TNode>
  ): void {
    this.matrix = createAdjacencyMatrix<TNodeSize, TNode>({
      length: this.length,
      edges,
      directedEdges
    });
    edges?.forEach((edge) => this.addEdge(edge));
    directedEdges?.forEach((edge) => this.addEdge(edge, false));
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
      length: this.length
    }).fill(Number.MAX_VALUE);

    // Starting index cannot be higher than length

    // The distance from the start node to itself is 0
    distances[start] = 0;

    // This contains whether a node was already visited
    const visited = [];
    // const visited = Array.from<boolean>({ length: this.offset }).fill(true);

    // path tree
    const path = Array.from<number | null>({ length: this.length });

    // The starting node does not
    // have a parent in path tree
    path[start] = null;

    // While there are nodes left to visit...
    for (;;) {
      // ... find the node with the currently shortest distance from the start node...
      let shortestDistance = Number.MAX_VALUE;
      let shortestIndex = -1;

      for (let index = 0; index < this.length; index += 1) {
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
      for (let index = 0; index < this.length; index += 1) {
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

    for (let index = 0; index < this.length; index += 1) {
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
   * @returns {boolean}
   */

  // eslint-disable-next-line class-methods-use-this
  public walkPathToTarget(
    path: Array<TNode | null>,
    target: TNode | null,
    callback?: (node: TNode | null) => void
  ): boolean {
    // Target is already at origin,
    // therefore we can not reach it by walking
    if (target === null) {
      return false;
    }

    // Target is unreachable from precalculated paths
    if (path[target] === undefined) {
      throw new Error("Cannot reach node");
    }

    for (const node of path) {
      callback?.(node);

      // Found target
      if (node === target) {
        return true;
      }
    }
    // Did not find target
    return false;
  }

  public forEachNode(callback: (node: number) => void): void {
    for (let index = 0; index < this.length; index += 1) {
      callback(index);
    }
    // (this.nodes as number[]).forEach((node) => callback(node));
  }

  // TODO: Make better
  // eslint-disable-next-line class-methods-use-this
  private callbackEdges(
    edges?: EdgeArray<TNode>,
    callback?: (
      edge: [a: number, b: number],
      bidirectional: boolean,
      conditional: boolean
    ) => void,
    bidirectional = true,
    conditional = false
  ): void {
    edges?.forEach((edge) =>
      callback?.(edge as [a: number, b: number], bidirectional, conditional)
    );
  }

  // TODO: Make better
  public forEachEdge(
    callback: (
      edge: [a: number, b: number],
      bidirectional: boolean,
      conditional: boolean
    ) => void,
    conditions: string[]
  ): void {
    if (conditions) {
      let hasDefault = false;

      if (conditions.includes("default")) {
        this.callbackEdges(this.data.edges, callback, true, false);
        this.callbackEdges(this.data.directedEdges, callback, false, false);
        hasDefault = true;
      }

      if (this.data.conditional) {
        for (const key of Object.keys(this.data.conditional)) {
          if (conditions.includes(key) || conditions.includes("all")) {
            if (
              !hasDefault &&
              this.data.conditional[key].extends?.includes("default")
            ) {
              this.callbackEdges(this.data.edges, callback, true, false);
              this.callbackEdges(
                this.data.directedEdges,
                callback,
                false,
                false
              );
              hasDefault = true;
            }

            if (this.data.conditional[key].extends) {
              this.data.conditional[key].extends?.forEach(
                (extendKey: string) => {
                  const data = this.data.conditional?.[extendKey];

                  this.callbackEdges(data?.edges, callback, true, true);
                  this.callbackEdges(
                    data?.directedEdges,
                    callback,
                    false,
                    true
                  );
                }
              );
            }

            this.callbackEdges(
              this.data.conditional[key].edges,
              callback,
              true,
              true
            );
            this.callbackEdges(
              this.data.conditional[key].directedEdges,
              callback,
              false,
              true
            );
          }
        }
      }
    } else {
      this.data.edges?.forEach((edge) =>
        callback(edge as [a: number, b: number], true, false)
      );
      this.data.directedEdges?.forEach((edge) =>
        callback(edge as [a: number, b: number], false, false)
      );
    }
  }
}
