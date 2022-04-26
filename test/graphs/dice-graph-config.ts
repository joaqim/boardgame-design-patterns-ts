import { createGraphData } from "../../src/graph";

/** Dice Node Graph
 * The layout of a die expressed as a node graph
 *
 * Could be used to rotate a visual representation of a die to
 * a desired result from any starting face of the die.
 *
 *                ______
 *               |0    |
 *               |     |
 *    ___________|____0|______
 *   |0   0|0   0|     |0    |
 *   |0   0|     |  0  |  0  |
 *   |0___0|0___0|_____|____0|
 *               |0   0|
 *               |  0  |
 *               |0___0|
 */

const DiceNodeGraph = createGraphData({
    length: 6,
    edges: [
        // 1 is adjacent to 4 numbers on the die
        [0, 1], [0, 2], [0, 3], [0, 4],
        // 6 is adjacent the same 4 numbers
        [5, 1], [5, 2], [5, 3], [5, 4],

        // The remaining edges goes between
        // the other 4 numbers of the die

        // 3 touches 2, and vice versa
        [2, 1],
        // 2 touches 4
        [1, 3],
        // 4 touches 5
        [3, 4],
        // 5 touches 3
        [4, 2],
    ],
});
export default DiceNodeGraph;
