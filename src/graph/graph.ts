import type GraphMap from "./graph-map";
import type { GraphEdge, GraphNode } from "./graph-map";

export interface GraphTile {
  id: number;
  children: GraphTile[];
}

export default class Graph {
  private readonly list = new Map();
  private readonly matrix: number[][] = [];

  public constructor(map: GraphMap) {
    map.nodes.forEach((node) => this.addNode(node));
    map.edges.forEach((edge) => this.addEdge(edge));
  }

  public addNode(node: GraphNode): void {
    this.list.set(node, []);

    for (const col of this.matrix) {
      col.push(0);
    }

    this.matrix.push(
      Array.from<number>({ length: this.matrix.length }).fill(0)
    );
  }

  public addEdge(edge: GraphEdge): void {
    const start = edge[0];
    const end = edge[1];
    this.list.get(start).push(end);
    this.list.get(end).push(start);
    this.matrix[start][end] = 1;
    this.matrix[end][start] = 1;
  }

  public addEdgeBetweenNodes(nodeA: GraphNode, nodeB: GraphNode): void {
    this.addEdge([nodeA, nodeB]);
  }

  public dfsPath(start: number, target: number): number[] | null {
    const stack = [start];
    const visited = new Set();
    visited.add(start);
    const path = [];

    while (stack.length > 0) {
      const current = stack.pop();

      if (current !== start) path.push(current);

      for (const neigh of this.list.get(current)) {
        if (!visited.has(neigh)) {
          visited.add(neigh);
          stack.push(neigh);

          // Found target!
          if (neigh === target) {
            path.push(neigh);
            return path;
          }
        }
      }
    }
    return null;
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

    // The starting vertex does not
    // have a parent
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
          // console.log("Updating distance of node " + i + " to " + distances[i]);
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
