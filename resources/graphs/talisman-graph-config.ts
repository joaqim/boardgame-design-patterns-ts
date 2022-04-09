/* eslint-disable prettier/prettier */
import { createGraph } from "../../src/graph";

/*
 * The board from Talisman the Boardgame represented as a Node Graph
 * Where nodes are the tiles of the board and the edges shows which tiles
 * are connected to eachother.
 */

const TalismanGraphConfig = Object.freeze(createGraph({
  length: 49,
  nodes: [
     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
     22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
     41, 42, 43, 44, 45, 46, 47, 48,
  ],

  edges: [
    // Outer ring
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 0],

    // The Sentinel Bridge
    [16, 35],

    // The middle ring
    [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32], [32, 33], [33, 34], [34, 35], [35, 36], [36, 37], [37, 38], [38, 39], [39, 24],

    // The Portal of Power
    [32, 40],

    //  the innermost ring
    [40, 41], [41, 42], [42, 43], [43, 47], [47, 46], [46, 45], [45, 44], [44, 40],

    // The Throne of Power ( not sure about name)
    [47, 48],
  ],
}));

export default TalismanGraphConfig
