```typescript
/**
 * A generic directed graph class.
 * @template TNodeSize - The size of each node in the graph.
 * @template TNode - The type of the node. Defaults to `Node<TNodeSize>`.
 */
export default class Graph<
  TNodeSize extends number,
  TNode extends number = Node<TNodeSize>
> {
  /**
   * The adjacency list of the graph.
   */
  private readonly list = new Map<TNode, TNode[]>();

  /**
   * The adjacency matrix of the graph.
   */
  private matrix?: AdjacencyMatrix<TNodeSize, TNode>;

  /**
   * Meta data about the graph.
   */
  private readonly data: GraphMetaData<TNodeSize, TNode>;

  /**
   * The nodes in the graph.
   */
  private readonly nodes: FixedArray<TNodeSize, TNode | null>;

  /**
   * The number of nodes in the graph.
   */
  public readonly length: number;

  /**
   * The regions in the graph.
   */
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private regions = new Map<string, Region<TNodeSize, TNode>>();

  /**
   * The distances between nodes in the graph.
   */
  public distances?: NodeDistances<TNodeSize>;

  /**
   * The path between nodes in the graph.
   */
  public path?: NodePath<TNode>;
  
  /**
 * Creates a new graph instance.
 * @param data - Meta data about the graph, including the length of the graph,
 *               the edges and directed edges of the graph, and the regions of the graph.
 */
public constructor(data: GraphMetaData<TNodeSize, TNode>) {
  if (data.length <= 0) {
    throw new Error("Graph: Cannot create graph with length of 0 or less.");
  }
  this.data = data;
  this.length = data.length;

  // Initialize the nodes array and adjacency list
  this.nodes = <FixedArray<TNodeSize, TNode | null>>Array.from(
    { length: data.length },
    (_value: undefined, index: number) => {
      this.list.set(createNode(index), []);
      return index;
    }
  );

  // Initialize the regions of the graph
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

  // Set the default region as the active region
  this.setRegion("default");
}

/**
 * Concatenates two edge arrays.
 * @param edgesLhs - The left-hand side edge array.
 * @param edgesRhs - The right-hand side edge array.
 * @returns The concatenated edge array, or `undefined` if both input arrays are `undefined`.
 */
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

/**
 * Concatenates two graph regions.
 * @param regionLhs - The left-hand side graph region.
 * @param regionRhs - The right-hand side graph region.
 * @returns The concatenated graph region.
 */
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

/**
 * Initializes a graph region.
 * @param region - The meta data about the graph region to initialize.
 * @returns The initialized graph region.
 */
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
      result = this.concatRegions(result, this.initializeRegion(extendRegion));
    }
  });
  return result;
}

/**
 * Sets the active region of the graph.
 * @param name - The name of the region to set as the active region.
 */
private setRegion(name: string): void {
  const region = this.regions.get(name);
  this.recalculate(region?.edges, region?.directedEdges);
}

/**
 * Recalculates the adjacency matrix and edges of the graph based on the given edges and directed edges.
 * @param edges - The edges of the graph.
 * @param directedEdges - The directed edges of the graph.
 */
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
 * Walks the given path and calls the callback function at each node.
 * @param start - The starting node of the path.
 * @param path - The path to walk.
 * @param callback - The function to call at each node.
 */
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

/**
 * Gets an array of nodes within reach of the given node.
 * @param reach - The maximum distance from the given node to include in the result.
 * @returns An array of nodes within reach of the given node.
 */
public nodesWithinReach(reach: TNode): TNode[] {
  const result: TNode[] = [];

  // Return an empty array if the distances and path are not set
  if (this.distances === undefined || this.path === undefined) {
    return result;
  }

  for (let index = 0; index

```
