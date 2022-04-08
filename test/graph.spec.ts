import { expect } from "chai";
import TalismanGraphConf from '../resources/graphs/talisman-graph-config';
import { createGraph, GraphMetaData } from "../src/graph";
import Graph from "../src/graph/graph";

        
// Prefer to use createGraph for helpful type conform, see diceNodeGraph
const flatNodeGraph: GraphMetaData<10, 0> = {
    length: 10,
    offset: 0,
    nodes: [0,1,2,3,4,5,6,7,8],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}
/*
 * Example of node graph with unconnected/unreachable nodes
 */
const unconnectedNode = Object.freeze(createGraph({
    length: 6,
    nodes: [0, 1, 2, /* unconnected nodes */ 3, 4, 5],
    edges: [[0, 1], [1, 2], /* 4 and 5 only see eachother */ [4, 5]]
}));
// ------------------------------------------------------------------------------
/* Dice Node Graph
 * The layout of a die expressed as a node graph
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

const diceNodeGraph = Object.freeze(createGraph({
    length: 7,
    offset: 1,
    nodes: [1, 2, 3, 4, 5, 6],
    edges: [
        // 1 is adjacent to 4 numbers on the die
        [1, 2], [1, 3], [1, 4], [1, 5],
        // 6 is adjacent the same 4 numbers
        [6, 2], [6, 3], [6, 4], [6, 5],

        // The remaining edges goes between
        // the other 4 numbers of the die

        // 3 touches 2, and vice versa
        [3, 2],
        // 3 touches 5
        [3, 5],
        // 5 touches 4
        [3, 4],
        // 4 touches 2
        [4, 2],
    ],
}));

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new Graph(flatNodeGraph)

        let {distances, path} = graph.generateDistancesAndPath(0)

        // The longest path possible is 9
        //expect(path.length).to.equal(9)
        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances.length).deep.equal(flatNodeGraph.nodes.length)
        expect(() => graph.walkPathToEnd(path)).to.not.throw()

        // If it is impossible to reach a node or if it is the starting node
        // the value stored in path will be null, and it will be 0 in distances,
        // which implies that no travel is possible/necessary to reach goal.
        ;({distances, path} = graph.generateDistancesAndPath(0))
        
        


    })
        /* TODO: show use case of path e.g travel through nodes
         * and their children to find path to target
         * maybe add a function that determines slowest path
         * and returns that, with optional 50/50 path choice on
         * tie in distances of paths
         */


    it("can't reach unconnected node", ()=> {
        const graph = new Graph(unconnectedNode)

        let {distances, path} = graph.generateDistancesAndPath()
        console.log(path)

        /* 
         * path = [null, 0, 1, undefined, undefined, undefined]
         * Where null is the starting node,
         * 0 indicates that the 1th node can see the 0th
         * 1 indicates that the 2th node can see the 1th 
         * undefined indicates that node 3 and up are unreachable
         */

        // For now, Number.MAX_VALUE is unreachable nodes
        expect(distances[3]).to.equal(Number.MAX_VALUE)
        expect(path[3]).to.equal(undefined) // undefined is unconnected/unreachable node
        //expect(() => graph.walkPathToEnd(path)).to.throw("Cannot travel to node")


        // If we regenaret distances and paths from 5 as starting point
        // We will only be able to reach its neighbour 6
        ;({distances, path} = graph.generateDistancesAndPath(5))
        expect(distances[4]).to.equal(1)
        expect(distances[3]).to.equal(Number.MAX_VALUE)
        // 4 sees 5
        expect(path[4]).to.equal(5)
        // 5 is the starting point, therefore null
        expect(path[5]).to.equal(null)




    })

    it('dice node graph', () => {
        const graph = new Graph(diceNodeGraph);

        // Where 1 is the starting node that all distances are calculated from
        // 1 is optional and will default to graph.offset, which is 1 in this case
        let {distances, path} = graph.generateDistancesAndPath() 

        expect(path.length + graph.offset).to.equal(distances.length)
        
        // How many 90 degrees turns do you have to rotate
        // a dice to go from 1 to 6 ( where index 0 is node 1 and 5 is 6)
        // distances = [0, 1, 1, 1, 1, 2]
        // Here distances[6] is node 6 which is the the furthest point
        // from the starting point of 1
        expect(distances[6]).to.equal(2)


        // Here the starting node is null since you can never 
        // travel to the starting point, and undefined is the starting offset
        // path =  [undefined, null, 0, 0, 0, 0, 1]
        expect(path.length).to.equal(diceNodeGraph.nodes.length)

        console.log(path)
        //expect(() => graph.walkPathToEnd(path)).to.not.throw()
        //expect(() => graph.walkPathToEnd(path)).to.throw("Cannot travel to node")

        // Distance from 1 to 2 on the die is 1
        expect(graph.dfsPath(1, 2).length).to.equal(1)
        // Distance from 1 to 6 on the die is 2,
        // which is the maximum distance to travel on a die
        expect(graph.dfsPath(1, 6).length).to.equal(2)
        // likewise with 6 to 1
        expect(graph.dfsPath(6, 1).length).to.equal(2)
        // and 5 to 2
        expect(graph.dfsPath(5, 2).length).to.equal(2)

        // while 5 is adjacent to 3
        expect(graph.dfsPath(5, 3).length).to.equal(1)
    })

    it("represents Talisman board as a graph", ()=> {
        const graph = new Graph(TalismanGraphConf)


        let {distances, path} = graph.generateDistancesAndPath(0) 

        // 18 is the longest you could walk on the board,
        // from 0 to 48 which is in the center of the board
        expect(distances[48]).to.equal(18)

    })
})