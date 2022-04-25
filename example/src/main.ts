/* eslint-disable prettier/prettier */
import { Graph } from "boardgame-design-patterns-ts";
import talismanBoardImgSource from "../assets/talisman_board_clone.png";
import TalismanGraphConfig from "../graphs/talisman-graph-config";
import { canvas_half_arrow } from "./canvas-draw";
import { TalismanNodeLayoutRelativePosition } from "./talisman-node-layout";

type GraphNode = [x: number, y: number];
type GraphEdge = [a: number, b: number];

class DrawingApp {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private readonly graph = new Graph(TalismanGraphConfig);
  private graphConditions: string[] = ["default"];
  private currentMap: "no_expansion" = "no_expansion";

  private img = new Image();


  private readonly buttonsDiv: HTMLDivElement;
  private readonly buttonsDefaultList = [
    ["default", "Show Default"],
    ["all", "Show All"]
  ];

  private readonly buttons = {
    default: [
      ["reaper", "Show the Reaper"],
      ["tavern_ferry", "Show the Tavern Ferry crossing"],
      ["innermost_region", "Show the Innermost Region"],
      ["storm_river", "Show all River Crossings"],
      ["sentinel_bridge", "Show the Sentinel Bridge"]
    ],
    city: [
      ["dock", "Show Dock ferry landings"]
    ]
  };

  public constructor() {
    // Canvas
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas = canvas;

    // Context
    const context = canvas.getContext("2d");
    this.context = context;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "black";
    context.lineWidth = 1;

    // Buttons
    const buttonsDefaultDiv = document.getElementById(
      "buttons-default"
    ) as HTMLDivElement;
    this.addButtons(buttonsDefaultDiv, this.buttonsDefaultList);

    this.buttonsDiv = document.getElementById("buttons") as HTMLDivElement;
    this.addButtons(this.buttonsDiv, this.buttons["default"]);
    this.addButtons(this.buttonsDiv, this.buttons["city"]);

    // Image
    this.img.src = talismanBoardImgSource;
    this.img.addEventListener(
      "load",
      () => {
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        this.redraw();
      },
      { once: true }
    );
  }

  private addButtons(parent: HTMLDivElement, buttonDefitinion: string[][]) {
    for (let def of buttonDefitinion) {
      let btn: HTMLButtonElement = document.createElement("button");
      btn.id = def[0];
      btn.textContent = def[1];
      btn.addEventListener("click", () => {
        this.graphConditions =
          btn.id.indexOf(",") !== -1 ? btn.id.split(",") : [btn.id];
        this.redraw();
      });
      parent.appendChild(btn);
    }
  }

  private redraw() {
    this.context.drawImage(this.img, 0, 0);
    this.drawGraph(this.graph);
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

    if (conditional) {
      context.strokeStyle = "red";
    } else {
      context.strokeStyle = bidirectional ? "cyan" : "green";
    }
    context.lineWidth = 2;
    const nodeA = TalismanNodeLayoutRelativePosition[edge[0]];
    const nodeB = TalismanNodeLayoutRelativePosition[edge[1]];
    const width = this.canvas.width;
    const height = this.canvas.height;
    const radius = 6;
    const x1 = nodeA[0] * width + radius;
    const y1 = nodeA[1] * height + radius;
    const x2 = nodeB[0] * width + radius;
    const y2 = nodeB[1] * height + radius;
    context.beginPath();
    if (bidirectional) {
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
    } else {
      canvas_half_arrow(context, x1, y1, x2, y2);
    }
    context.stroke();
  }

  private drawGraph(graph: Graph<49>): void {
    graph.forEachEdge(
      (edge: GraphEdge, bidirectional: boolean, conditional: boolean): void => {
        this.drawEdge(edge, bidirectional, conditional);
      },
      this.graphConditions
    );
    graph.forEachNode((node: number): void => {
      const pos = TalismanNodeLayoutRelativePosition[node];

      this.drawNode([pos[0] * this.canvas.width, pos[1] * this.canvas.height]);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = new DrawingApp();
