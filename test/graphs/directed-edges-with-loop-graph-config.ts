import { GraphMetaData } from "../../src/graph";

/*  Directed Node Graph with Looping and bidirectional edges
 *  To get back to 4 you would have to loop around
 *  and enter from 3 again.
 *
 *   1-----2             V: One way
 *   |     |
 *   |     3
 *   |     V
 *   |     4--5
 *   |     V
 *   6-----5
 */
const DirectedEdgesWithLoopingNodeGraph: GraphMetaData<6> = {
    length: 6,
    edges: [
        [0, 1],
        [1, 2],

        /* 2 -> 3 is one-way */

        [3, 4],

        /* 3 -> 5 is one-way */

        [5, 0]
    ],
    /* edges with only one direction */
    directedEdges: [[2,3], [3, 5]]
};
export default DirectedEdgesWithLoopingNodeGraph