/* eslint-disable prettier/prettier */
import { Graph } from "boardgame-design-patterns-ts";
import talismanBoardImgSource from "../assets/talisman_board.png";
import TalismanGraphConfig from "../graphs/talisman-graph-config";
import { TalismanNodeLayoutRelativePosition } from "./talisman-node-layout";

type GraphNode = [x: number, y: number];
type GraphEdge = [a: number, b: number];

class DrawingApp {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly nodes: GraphNode[];
  private readonly edges: GraphEdge[];

  private readonly graph = new Graph(TalismanGraphConfig);

  public constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    this.canvas = canvas;
    this.context = context;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;

    const boardImg = new Image();
    boardImg.src = talismanBoardImgSource;
    boardImg.addEventListener(
      "load",
      () => {
        canvas.width = boardImg.width;
        canvas.height = boardImg.height;
        context.drawImage(boardImg, 0, 0);
        this.drawGraph(this.graph);
      },
      { once: true }
    );
  }

  private drawNode(node: GraphNode, radius = 6): void {
    const context = this.context;
    context.beginPath();
    context.strokeStyle = "black";
    context.fillStyle = "blue";
    context.arc(
      node[0] + radius,
      node[1] + radius,
      radius,
      0,
      Math.PI * 2,
      true
    );
    context.stroke();
    context.fill();
  }

  private drawEdge(
    edge: GraphEdge,
    bidirectional = true,
    conditional = false
  ): void {
    const context = this.context;

    if (conditional && bidirectional) {
      context.strokeStyle = "red";
    } else {
      context.strokeStyle = bidirectional ? "cyan" : "darkblue";
    }
    context.lineWidth = 2;
    const nodeA = TalismanNodeLayoutRelativePosition[edge[0]];
    const nodeB = TalismanNodeLayoutRelativePosition[edge[1]];
    const width = this.canvas.width;
    const height = this.canvas.height;
    const radius = 6;
    context.beginPath();
    context.moveTo(nodeA[0] * width + radius, nodeA[1] * height + radius);
    context.lineTo(nodeB[0] * width + radius, nodeB[1] * height + radius);
    context.stroke();
  }

  private drawGraph(graph: Graph<49>): void {
    graph.forEachEdge(
      (edge: GraphEdge, bidirectional: boolean, conditional: boolean): void => {
        this.drawEdge(edge, bidirectional, conditional);
      },
      ["all"]
    );
    graph.forEachNode((node: number): void => {
      const pos = TalismanNodeLayoutRelativePosition[node];

      this.drawNode([pos[0] * this.canvas.width, pos[1] * this.canvas.height]);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new DrawingApp();
