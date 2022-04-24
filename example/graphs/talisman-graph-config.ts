/* eslint-disable prettier/prettier */
import { createGraph } from "boardgame-design-patterns-ts";

/*
 * The board from Talisman the Boardgame represented as a Node Graph
 * Where nodes are the tiles of the board and the edges shows which tiles
 * are connected to eachother.
 */

const TalismanGraphConfig = Object.freeze(createGraph<49>({
  length: 49,
  edges: [
    // Outer ring
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 0],

    // The middle ring
    [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32], [32, 33], [33, 34], [34, 35], [35, 36], [36, 37], [37, 38], [38, 39], [39, 24],
  ],
  conditional: {
    // The Portal of Power can only be crossed conditonally.
    "portal_of_power": {
      edges: [[32, 40]]
    },
    // Any step taken in the innermost ring can only be taken conditonally
    "innermost_region": {
      edges: [
        // Path of strength
        [40, 41], [41, 42], [42, 43], [43, 47],
        // Path of wisdom
        [40, 44], [44, 45], [45, 46], [46, 47],

      ],
      directedEdges: [
        // Crown of Command can only be crossed one-way
        // i.e you can't walk out once you are on the throne
        [47, 48]
      ]
    },
    // Use the Tavern Ferry to cross over The Storm River to the Temple
    "tavern_ferry": {
      directedEdges: [[18, 36]]
    },
    // The Sentinel Bridge can only be crossed conditonally ( after defating or avoiding The Sentinel.)
    "sentinel_bridge": {
      edges: [
        [16, 35]
      ],
    },
    // Raft can be used to cross The Storm River
    // Dock in City Expansion can be used to land on any node connected 
    // to these edges
    "storm_river": {
      edges: [
        [0, 24],
        [1, 24], [1, 25],
        [2, 25], [2, 26],
        [3, 26],
        [4, 26], [4, 27],
        [5, 27], [5, 28],
        [6, 28],
        [7, 28],
        [8, 28], [8, 29], [8, 30],
        [9, 30], [9, 31],
        [10, 31], [10, 32],
        [11, 32],
        [12, 32],
        [13, 32], [13, 33],
        [14, 33], [14, 34],
        [15, 34],
        [16, 34], [16, 35],
        [17, 35], [17, 36],
        [18, 36],
        [19, 36],
        [20, 36], [20, 37], [20, 38],
        [21, 38], [21, 39],
        [22, 39], [22, 24],
        [23, 24],
      ]
    },
    // Reaper can cross The Sentinel Bridge and from the Tavern to the Temple (or vice versa.)
    "reaper": {
      edges: [
        // The Sentinel Bridge
        [16, 35],
        // Tavern Ferry to cross The Storm River
        [6, 28]
      ]
    }
  }
}));

export default TalismanGraphConfig
