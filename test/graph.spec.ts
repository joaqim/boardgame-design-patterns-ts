import { expect } from "chai";
import TalismanGraphConf from '../resources/graphs/talisman-graph-config';
import { createGraph, GraphMetaData, NodePath, nodeToNumber } from "../src/graph";
import Graph from "../src/graph/graph";

        
// Prefer to use createGraph for helpful typescript hints, see other graphs
const flatNodeGraph: GraphMetaData<9> = {
    nodes: [0,1,2,3,4,5,6,7,8],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
}
/*
 * Example of node graph with unconnected/unreachable nodes
 */
const unconnectedNode = Object.freeze(createGraph({
    length: 6,
    nodes: [0, 1, 2, /* unconnected nodes */ 3, 4, 5],
    edges: [
        [0, 1], [1, 2], 
        [4, 5] /* 4 and 5 only see eachother, while 3 sees none */]
}));

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

const diceNodeGraph = Object.freeze(createGraph({
    length: 6,
    offset: 1, // We offset array by 1 to start node index at 1 for clarity
    nodes: [
        /** TODO: For now, only 0 is guaranteed to exist in any array
         * and can be assigned null. We need more dynamically created
         * nullable slots for larger offset than 1
         */
        null, /* this is the unused node held by the offset index */
        1, 2, 3, 4, 5, 6],
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

const walkPath = <TNode>(start: TNode, path: NodePath<TNode>): void => {
    if(start === null) return;
    console.log(start)
    walkPath(path[nodeToNumber(start)], path)
}

describe('graph', ()=> {

    it('flat node graph', () => {
        const graph = new Graph(flatNodeGraph)

        let {distances, path} = graph.generateDistancesAndPath(0)

        // The longest path possible is 9
        expect(path.length).to.equal(9)
        // path = [null, 0, 1 ... 7] of length 9

        // Since the graph is 1 dimensional, all distances between the nodes
        // are the same as their id which corresponds to their index in array
        expect(distances.length).deep.equal(flatNodeGraph.nodes.length)
        expect(() => graph.walkPathToEnd(path)).to.not.throw()

        expect(() => graph.walkPathToTarget(path,8)).to.not.throw()


    })

    it("can't reach unconnected node", ()=> {
        const graph = new Graph(unconnectedNode)

        let {distances, path} = graph.generateDistancesAndPath()

        /**
         * path = [null, 0, 1, undefined, undefined, undefined]
         * Where null is the starting node,
         * 0 .. 1 are the next reachable nodes
         * [... undefined] indicates that the rest of nodes
         * are unreachable from 0
         */


        // For now, Number.MAX_VALUE is unreachable nodes
        expect(distances[3]).to.equal(Number.MAX_VALUE)

        // If it is impossible to reach a node or if it is the starting node
        // and the value stored in that index of path array will be undefined, 
        // which is different than null, which implies you're at the start/origin
        // of the calculated paths/distances
        expect(path[3]).to.equal(undefined)

        // Can travel from 0 to 2 here, which is the last reachable node from 0
        expect(() => graph.walkPathToEnd(path)).to.not.throw()
        
        // Can travel from 0 to 2 here aswell
        expect(() => graph.walkPathToTarget(path,2)).to.not.throw()
        // Cannot reach 3 from starting point of 0
        expect(() => graph.walkPathToTarget(path,3)).to.throw("Cannot reach node")

        // If we regenaret distances and paths from 5 as starting point
        // We will only be able to reach its neighbour 6
        ;({distances, path} = graph.generateDistancesAndPath(5))
        expect(distances[4]).to.equal(1)
        expect(distances[3]).to.equal(Number.MAX_VALUE)
        // 4 sees 5
        expect(path[4]).to.equal(5)
        // 5 is the starting point, therefore null
        expect(path[5]).to.equal(null)

        // We cannot reach node 0 from starting point of 5
        expect(() => graph.walkPathToTarget(path,0)).to.throw("Cannot reach node")
    })

    it('dice node graph', () => {
        const graph = new Graph(diceNodeGraph);

        // Where 1 is the starting node that all distances are calculated from
        // 1 is optional and will default to graph.offset, which is 1 in this case
        let {distances, path} = graph.generateDistancesAndPath() 

        expect(path.length + graph.offset).to.equal(distances.length)
        // TODO:

        // How many 90 degrees turns do you have to rotate
        // a dice to go from 1 to 6 ( where index 0 is node 1 and 5 is 6)
        // distances = [0, 1, 1, 1, 1, 2]
        // Here distances[6] is node 6 which is the the furthest point
        // from the starting point of 1
        expect(distances[6]).to.equal(2)


        // Here the starting node is null since you can never 
        // travel to the starting point, and undefined is the starting offset
        // TODO: Should path equal something else?
        // path =  [undefined, null, 0, 0, 0, 0, 1]
        expect(path.length).to.equal(diceNodeGraph.nodes.length)
        expect(() => graph.walkPathToTarget(path, 6)).to.not.throw()

        // Distance from 1 to 2 on the die is 1
        expect(graph.dfsPath(1, 2).length).to.equal(1)
        // Distance from 1 to 6 on the die is 2,
        // which is the maximum distance to travel
        // on a die, the opposites sides always adds
        // up to 7
        expect(graph.dfsPath(1, 6).length).to.equal(2)
        // likewise with 6 to 1
        expect(graph.dfsPath(6, 1).length).to.equal(2)
        // and 5 to 2
        expect(graph.dfsPath(5, 2).length).to.equal(2)
        // while 5 is adjacent to 3
        expect(graph.dfsPath(5, 3).length).to.equal(1)

        //console.log(graph.nodesWithinReach(1))
        //expect(graph.nodesWithinReach(1)).to.deep.equal([])
    })

    it("represents Talisman board as a graph", ()=> {
        const graph = new Graph(TalismanGraphConf)


        let {distances, path} = graph.generateDistancesAndPath(0) 

        /**
         * With 0 being the top left corner of the board
         * 18 steps is the longest you could move
         * between node 0 from node 48, which is in
         * the  center of the board
         */

        expect(distances[48]).to.equal(18)

        expect(graph.nodesWithinReach(0)).to.deep.equal([])
        // 0 is at corner between 1 and 23
        expect(graph.nodesWithinReach(1)).to.deep.equal([1, 23])
        // if you continue further away you can reach 2, and 22
        expect(graph.nodesWithinReach(2)).to.deep.equal([1, 2, 22, 23])

        //console.log(path)

        //;({distances, path} = graph.generateDistancesAndPath(48))
        //console.log(distances)
        //console.log(path)
        //walkPath(0, path)
    })
})